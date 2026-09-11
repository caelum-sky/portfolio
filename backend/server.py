"""
Portfolio backend — FastAPI
• No MongoDB. Visitor locations stored in a local JSON file.
• Contact form messages forwarded to your Gmail via SMTP.
"""

from __future__ import annotations

import json
import logging
import os
import smtplib
import threading
from datetime import datetime, timezone
from email.mime.text import MIMEText
from pathlib import Path
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

# ── Config ────────────────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

CORS_ORIGINS: list[str] = os.environ.get("CORS_ORIGINS", "*").split(",")

# Path to the JSON file that stores visitor locations.
# On Render this lives inside the service's ephemeral disk — fine for a cosmetic globe.
VISITS_FILE = ROOT_DIR / "visitor_locations.json"

# ── In-memory visitor store (backed by the JSON file) ─────────────────────────

_lock = threading.Lock()


def _load_visits() -> dict[str, dict]:
    if VISITS_FILE.exists():
        try:
            return json.loads(VISITS_FILE.read_text())
        except Exception:
            pass
    return {}


def _save_visits(store: dict[str, dict]) -> None:
    VISITS_FILE.write_text(json.dumps(store, ensure_ascii=False, indent=2))


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


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


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
    msg["From"] = smtp_user
    msg["To"] = smtp_to
    msg["Reply-To"] = sender_email

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
    forwarded = request.headers.get("X-Forwarded-For", "")
    ip = (forwarded.split(",")[0] if forwarded else (request.client.host or "")).strip()

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


# ── App assembly ──────────────────────────────────────────────────────────────

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)
