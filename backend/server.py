"""
Portfolio backend — FastAPI
• No MongoDB. Visitor locations stored in a local JSON file.
• Contact form messages forwarded to your Gmail via SMTP.
"""

from __future__ import annotations

import json
import logging
import os
import re
import smtplib
import threading
from datetime import datetime, timezone
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request, UploadFile, Form, File
from pydantic import BaseModel, Field, field_validator
from starlette.middleware.cors import CORSMiddleware

# ── Config ────────────────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

CORS_ORIGINS: list[str] = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()
]

UPLOAD_PIN: str = os.environ.get("UPLOAD_PIN", "")

# Path to the JSON file that stores visitor locations.
# On Render this lives inside the service's ephemeral disk — fine for a cosmetic globe.
VISITS_FILE = ROOT_DIR / "visitor_locations.json"

# Public dir for swappable assets (profile photo, resume)
PUBLIC_DIR = ROOT_DIR / "public"
PUBLIC_DIR.mkdir(exist_ok=True)

# ── Logging ───────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ── HTTP client — module-level, shared connection pool ────────────────────────
# Fix #8: creating a fresh AsyncClient per request caused socket exhaustion.
_http_client: httpx.AsyncClient = httpx.AsyncClient(
    timeout=httpx.Timeout(5.0, connect=3.0),
    limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
)

# ── In-memory visitor store (backed by the JSON file) ─────────────────────────

_lock = threading.Lock()

# Simple IPv4 / IPv6 pattern — only used to filter obviously spoofed values
_IP_RE = re.compile(
    r"^("
    r"(\d{1,3}\.){3}\d{1,3}"          # IPv4
    r"|"
    r"[0-9a-fA-F:]{2,39}"             # IPv6 (abbreviated forms accepted)
    r")$"
)


def _is_valid_ip(ip: str) -> bool:
    """Quick sanity-check — rejects obviously fake strings before hitting ip-api."""
    return bool(ip and _IP_RE.match(ip))


def _load_visits() -> dict[str, dict]:
    """
    Load visits from the JSON file.
    Fix #4: validates the parsed value is actually a dict; on any error it logs
    a warning and starts fresh rather than silently losing data.
    """
    if not VISITS_FILE.exists():
        return {}
    try:
        raw = VISITS_FILE.read_text(encoding="utf-8")
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise ValueError(f"Expected dict, got {type(data).__name__}")
        return data
    except Exception as exc:
        logger.warning(
            "visits file unreadable/corrupt (%s) — starting with empty store. "
            "Corrupted file backed up as visitor_locations.json.bak",
            exc,
        )
        # Back up the corrupt file so data isn't silently discarded
        try:
            VISITS_FILE.rename(ROOT_DIR / "visitor_locations.json.bak")
        except Exception:
            pass
        return {}


def _save_visits(store: dict[str, dict]) -> None:
    # Write to a temp file then rename for atomicity
    tmp = VISITS_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(store, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(VISITS_FILE)


# Load into memory on startup
_visits: dict[str, dict] = _load_visits()

# ── FastAPI app ───────────────────────────────────────────────────────────────
# Fix #3: create the app first, add middleware BEFORE include_router, then mount routes.

app = FastAPI(title="JSD Portfolio API")

# CORS must be added before any routes so it wraps every request including 404s.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# ── Models ────────────────────────────────────────────────────────────────────

# Fix #5: use Pydantic's EmailStr for proper RFC-5321 email validation.
# Requires `email-validator` in requirements.txt.
try:
    from pydantic import EmailStr  # noqa: E402

    _email_type = EmailStr
except ImportError:
    # Graceful fallback if email-validator isn't installed yet
    _email_type = str  # type: ignore[assignment]
    logger.warning("email-validator not installed — email field uses plain string validation.")


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: _email_type  # type: ignore[valid-type]
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("email", mode="before")
    @classmethod
    def strip_email(cls, v: str) -> str:
        return v.strip().lower() if isinstance(v, str) else v


# ── Basic routes ──────────────────────────────────────────────────────────────


@api_router.get("/")
async def root():
    return {"message": "JSD Portfolio API — no database required"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


# ── Contact — email via SMTP ──────────────────────────────────────────────────


def _send_email(name: str, sender_email: str, message: str) -> None:
    """
    Send a contact-form submission to SMTP_TO_EMAIL.
    Uses Gmail SMTP with an App Password (SMTP_USER / SMTP_PASS env vars).
    This runs synchronously but is called in a thread so it doesn't block.
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
    msg["Subject"] = f"[Portfolio] Message from {name}"
    # Fix #6: From header includes display name for clarity in email clients.
    # Reply-To is set to the sender so you can reply directly.
    msg["From"] = f"{smtp_user}"
    msg["To"] = smtp_to
    msg["Reply-To"] = f"{name} <{sender_email}>"

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, [smtp_to], msg.as_string())
        logger.info("Contact email sent from %s", sender_email)
    except Exception as exc:
        logger.error("SMTP send failed: %s", exc)


@api_router.post("/contact")
async def create_contact_message(payload: ContactMessageCreate):
    # Fire off the email in a background thread so the HTTP response is instant
    threading.Thread(
        target=_send_email,
        args=(payload.name, payload.email, payload.message),
        daemon=True,
    ).start()
    logger.info("Contact from %s <%s>", payload.name, payload.email)
    return {"ok": True}


# ── Asset upload (owner-only) ──────────────────────────────────────────────────


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 2 * 1024 * 1024   # 2 MB
MAX_PDF_BYTES   = 5 * 1024 * 1024   # 5 MB


@api_router.post("/assets/upload")
async def upload_asset(
    kind: str = Form(...),
    pin: str = Form(...),
    file: UploadFile = File(...),
):
    """
    Owner-only endpoint to replace /public/profile.jpg or /public/resume.pdf.
    Validates pin server-side; never trusts the client alone.
    """
    if not UPLOAD_PIN:
        raise HTTPException(status_code=503, detail="Upload not configured on this server")

    if pin.strip() != UPLOAD_PIN:
        logger.warning("Failed upload attempt with wrong pin for kind=%s", kind)
        raise HTTPException(status_code=401, detail="Invalid pin")

    if kind == "photo":
        content_type = file.content_type or ""
        if content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images accepted")
        data = await file.read()
        if len(data) > MAX_IMAGE_BYTES:
            raise HTTPException(status_code=400, detail="Image must be under 2 MB")
        dest = PUBLIC_DIR / "profile.jpg"
        dest.write_bytes(data)
        logger.info("Profile photo updated (%d bytes)", len(data))
        return {"ok": True, "path": "/public/profile.jpg"}

    elif kind == "resume":
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files accepted for resume")
        data = await file.read()
        if len(data) > MAX_PDF_BYTES:
            raise HTTPException(status_code=400, detail="PDF must be under 5 MB")
        dest = PUBLIC_DIR / "resume.pdf"
        dest.write_bytes(data)
        logger.info("Resume updated (%d bytes)", len(data))
        return {"ok": True, "path": "/public/resume.pdf"}

    else:
        raise HTTPException(status_code=400, detail="kind must be 'photo' or 'resume'")


# ── Visitor geo tracking ──────────────────────────────────────────────────────


async def _geo_lookup(ip: str) -> Optional[dict]:
    """
    Resolve IP → lat/lon/city/country via the free ip-api.com service.
    Fix #8: uses the module-level _http_client (connection pooling).
    Fix #7: validates IP format before making the external request.
    """
    if ip in ("127.0.0.1", "::1", "testclient", ""):
        return None
    # Fix #7: reject spoofed / non-IP strings before hitting ip-api
    if not _is_valid_ip(ip):
        logger.debug("Skipping geo lookup for non-IP value: %r", ip)
        return None
    try:
        r = await _http_client.get(
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
    except Exception as exc:
        logger.debug("Geo lookup failed for %s: %s", ip, exc)
    return None


@api_router.post("/visits/ping")
async def record_visit(request: Request):
    """
    Called by the frontend on every page load.
    Resolves the visitor's IP → lat/lon and upserts into the JSON store.
    Fails silently — never blocks page load.
    """
    forwarded = request.headers.get("X-Forwarded-For", "")
    # Take only the first (leftmost) IP — the client IP before any proxies
    raw_ip = (forwarded.split(",")[0] if forwarded else (request.client.host or "")).strip()

    geo = await _geo_lookup(raw_ip)
    if geo:
        key = f"{geo['country_code']}:{geo['city']}"
        now = datetime.now(timezone.utc).isoformat()
        with _lock:
            existing = _visits.get(key)
            if existing:
                existing["count"] = existing.get("count", 0) + 1
                existing["last_seen"] = now
                existing["lat"] = geo["lat"]
                existing["lon"] = geo["lon"]
            else:
                _visits[key] = {**geo, "count": 1, "first_seen": now, "last_seen": now}
            try:
                _save_visits(_visits)
            except Exception as exc:
                logger.warning("Could not persist visits file: %s", exc)

    return {"ok": True}


@api_router.get("/visits/geo")
async def get_visitor_locations():
    """
    Returns all aggregated visitor locations for the FooterGlobe canvas.
    Shape: { locations: [ { lat, lon, city, country, count } ] }
    """
    with _lock:
        locations = sorted(_visits.values(), key=lambda x: x.get("count", 0), reverse=True)
    return {"locations": locations[:200]}


# ── App assembly — routes mounted AFTER middleware is already added ─────────────

app.include_router(api_router)


# ── Shutdown: close the shared HTTP client cleanly ─────────────────────────────

@app.on_event("shutdown")
async def shutdown_event():
    await _http_client.aclose()
    logger.info("HTTP client closed.")
