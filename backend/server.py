"""
Portfolio backend — FastAPI
• No MongoDB. Visitor locations stored in a local JSON file (versioned schema).
• Contact form messages forwarded to your Gmail via SMTP (background task queue).
"""

from __future__ import annotations

import json
import logging
import os
import re
import smtplib
import threading
import time
from datetime import datetime, timezone
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, BackgroundTasks, Request
from pydantic import BaseModel, ConfigDict, Field, field_validator
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

# ── Config ────────────────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Comma-separated allowlist. Defaults to the known frontends — never "*" in prod.
DEFAULT_ORIGINS = "https://portfolio-8902f.web.app,https://portfolio-8902f.firebaseapp.com,http://localhost:5173,http://127.0.0.1:5173"
CORS_ORIGINS: list[str] = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", DEFAULT_ORIGINS).split(",") if o.strip()
]

# Path to the JSON file that stores visitor locations.
# On Render this lives inside the service's ephemeral disk — fine for a cosmetic globe.
VISITS_FILE = ROOT_DIR / "visitor_locations.json"
# Maximum number of visitor entries to store (oldest will be removed)
MAX_VISITS = 1000

# Current on-disk schema version for the visits store (see _migrate_store).
SCHEMA_VERSION = 2

# ── Rate limiting (in-memory sliding window, per client IP) ───────────────────

RATE_LIMITS = {
    # bucket            max requests  window (seconds)
    "contact": (5, 300),      # 5 messages / 5 min / IP
    "visits": (30, 60),       # 30 pings / min / IP
}
_rate_lock = threading.Lock()
_rate_buckets: dict[str, dict[str, list[float]]] = {k: {} for k in RATE_LIMITS}


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For", "")
    return (forwarded.split(",")[0] if forwarded else (request.client.host or "")).strip()


def _rate_limited(bucket: str, ip: str) -> bool:
    """True when `ip` has exceeded the allowance for `bucket`."""
    limit, window = RATE_LIMITS[bucket]
    now = time.monotonic()
    with _rate_lock:
        hits = _rate_buckets[bucket].setdefault(ip, [])
        # Drop hits outside the window, then check the count
        hits[:] = [t for t in hits if now - t < window]
        if len(hits) >= limit:
            return True
        hits.append(now)
        # Bound memory: keep at most 10k tracked IPs per bucket
        if len(_rate_buckets[bucket]) > 10_000:
            _rate_buckets[bucket].clear()
    return False


# ── In-memory visitor store (backed by the JSON file, versioned schema) ───────

_lock = threading.Lock()


def _migrate_store(raw: object) -> dict[str, dict]:
    """
    Schema migrations for visitor_locations.json.

    v1 (legacy): top-level dict keyed "CC:City" → {lat, lon, city, ...}
    v2 (current): {"schema_version": 2, "visits": { ...same dict... }}

    Unknown / corrupt payloads degrade gracefully to an empty store.
    """
    if not isinstance(raw, dict):
        return {}
    if raw.get("schema_version") == SCHEMA_VERSION and isinstance(raw.get("visits"), dict):
        return raw["visits"]
    # Legacy v1: the whole file is the visits dict
    return {k: v for k, v in raw.items() if isinstance(v, dict) and "lat" in v and "lon" in v}


def _load_visits() -> dict[str, dict]:
    if VISITS_FILE.exists():
        try:
            return _migrate_store(json.loads(VISITS_FILE.read_text()))
        except Exception:
            pass
    return {}


def _save_visits(store: dict[str, dict]) -> None:
    payload = {"schema_version": SCHEMA_VERSION, "visits": store}
    VISITS_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2))


# Load into memory on startup
_visits: dict[str, dict] = _load_visits()

# ── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ── Models ────────────────────────────────────────────────────────────────────

_HEADER_INJECTION_RE = re.compile(r"[\r\n]+")

# Same rule as the frontend (contactValidation.js) — deliberately dependency-free
# so the app can never be broken by a stale build env missing email-validator.
_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")


class ContactMessageCreate(BaseModel):
    """Inbound contact-form payload. Extra honeypot fields are accepted."""

    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=120)
    email: str = Field(max_length=200)
    message: str = Field(min_length=10, max_length=5000)
    # Honeypot — real users never see/fill this field
    website: str = Field(default="", max_length=200)

    @field_validator("email")
    @classmethod
    def _valid_email(cls, v: str) -> str:
        if not _EMAIL_RE.match(v):
            raise ValueError("invalid email address")
        return v.lower()

    @field_validator("name")
    @classmethod
    def _no_header_injection(cls, v: str) -> str:
        # Strip CR/LF so the value can never inject SMTP headers (Subject line)
        cleaned = _HEADER_INJECTION_RE.sub(" ", v).strip()
        if len(cleaned) < 2:
            raise ValueError("name too short after sanitizing")
        return cleaned


class VisitLocationOut(BaseModel):
    """
    API resource transformation — the ONLY fields the public geo endpoint
    may expose. Internal bookkeeping (first_seen, last_seen, country_code)
    is intentionally withheld.
    """

    lat: float
    lon: float
    city: str = ""
    country: str = ""
    count: int = 0


class ContactResponse(BaseModel):
    ok: bool = True


# ── Basic routes ──────────────────────────────────────────────────────────────


@api_router.get("/")
async def root():
    return {"message": "JSD Portfolio API — no database required"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


# ── Contact — email via SMTP, queued as a background task ─────────────────────

_EMAIL_MAX_ATTEMPTS = 3
_EMAIL_BACKOFF_S = 2.0


def _send_email(name: str, sender_email: str, message: str) -> None:
    """
    Send a contact-form submission to SMTP_TO_EMAIL with simple retry/backoff.
    Runs inside FastAPI's background-task worker (starlette threadpool), so the
    HTTP response returns immediately while delivery is retried off-request.
    """
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")
    smtp_to = os.environ.get("SMTP_TO_EMAIL", smtp_user)
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))

    if not smtp_user or not smtp_pass:
        logger.warning("SMTP not configured — contact email not sent.")
        return

    body = (
        f"New portfolio contact from {name} <{sender_email}>\n"
        f"{'─' * 50}\n"
        f"{message}\n"
        f"{'─' * 50}\n"
        f"Received: {datetime.now(timezone.utc).isoformat()}"
    )

    msg = MIMEText(body, "plain", "utf-8")
    # Belt-and-braces: strip CR/LF again right at the header boundary
    msg["Subject"] = f"[Portfolio] Message from {_HEADER_INJECTION_RE.sub(' ', name)}"
    msg["From"] = smtp_user
    msg["To"] = smtp_to
    msg["Reply-To"] = sender_email

    for attempt in range(1, _EMAIL_MAX_ATTEMPTS + 1):
        try:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.ehlo()
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [smtp_to], msg.as_string())
            logger.info("Contact email sent from %s (attempt %d)", sender_email, attempt)
            return
        except Exception as exc:
            logger.error("SMTP send failed (attempt %d/%d): %s", attempt, _EMAIL_MAX_ATTEMPTS, exc)
            if attempt < _EMAIL_MAX_ATTEMPTS:
                time.sleep(_EMAIL_BACKOFF_S * attempt)


@api_router.post("/contact", response_model=ContactResponse)
async def create_contact_message(payload: ContactMessageCreate, request: Request, background: BackgroundTasks):
    ip = _client_ip(request)

    # Honeypot tripped → pretend success, queue nothing (frustrates bots)
    if payload.website:
        logger.info("Honeypot tripped from %s — dropping silently", ip)
        return ContactResponse()

    if _rate_limited("contact", ip):
        return JSONResponse(status_code=429, content={"detail": "Too many messages — try again later."})

    # Queue the email as a background task (retrying worker, off the request path)
    background.add_task(_send_email, payload.name, str(payload.email), payload.message)
    logger.info("Contact from %s <%s>", payload.name, payload.email)
    return ContactResponse()


# ── Visitor geo tracking ──────────────────────────────────────────────────────


async def _geo_lookup(ip: str) -> Optional[dict]:
    """Resolve IP → lat/lon/city/country via the free ip-api.com service."""
    if ip in ("127.0.0.1", "::1", "testclient", ""):
        return None
    try:
        async with httpx.AsyncClient(timeout=4) as hc:
            r = await hc.get(
                f"http://ip-api.com/json/{ip}",
                params={"fields": "status,lat,lon,city,country,countryCode"},
            )
            data = r.json()
            if data.get("status") == "success":
                return {
                    "lat": data["lat"],
                    "lon": data["lon"],
                    "city": data.get("city", ""),
                    "country": data.get("country", ""),
                    "country_code": data.get("countryCode", ""),
                }
    except Exception:
        pass
    return None


@api_router.post("/visits/ping")
async def record_visit(request: Request):
    """
    Called by the frontend on every page load.
    Resolves the visitor's IP → lat/lon and upserts into the JSON store.
    Fails silently — never blocks page load.
    """
    global _visits  # required: this function rebinds _visits when pruning

    ip = _client_ip(request)
    if _rate_limited("visits", ip):
        return {"ok": True}  # silently accept — this endpoint must never error

    geo = await _geo_lookup(ip)
    if geo:
        key = f"{geo['country_code']}:{geo['city']}"
        now = datetime.now(timezone.utc).isoformat()
        with _lock:
            existing = _visits.get(key)
            if existing:
                existing["count"] = existing.get("count", 0) + 1
                existing["last_seen"] = now
                # update coords in case ip-api gives us a fresher value
                existing["lat"] = geo["lat"]
                existing["lon"] = geo["lon"]
            else:
                _visits[key] = {**geo, "count": 1, "first_seen": now, "last_seen": now}
            # Enforce maximum number of visitor entries (oldest last_seen first)
            if len(_visits) > MAX_VISITS:
                sorted_items = sorted(_visits.items(), key=lambda kv: kv[1].get("last_seen", ""))
                _visits = dict(sorted_items[-MAX_VISITS:])
            try:
                _save_visits(_visits)
            except Exception as exc:
                logger.warning("Could not persist visits file: %s", exc)

    return {"ok": True}


@api_router.get("/visits/geo", response_model=dict)
async def get_visitor_locations():
    """
    Aggregated visitor locations for the FooterGlobe canvas.
    Each entry passes through VisitLocationOut — the API resource
    transformation that strips internal bookkeeping fields.
    Shape: { locations: [ { lat, lon, city, country, count } ] }
    """
    with _lock:
        top = sorted(_visits.values(), key=lambda x: x.get("count", 0), reverse=True)[:200]
        locations = [VisitLocationOut(**v).model_dump() for v in top]
    return {"locations": locations}


# ── App assembly ──────────────────────────────────────────────────────────────

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,  # no cookies/auth headers cross-origin — keep it tight
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
