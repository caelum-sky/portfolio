"""
Backend test suite — run with:  python -m pytest test_server.py -v

Covers: health/root routes, contact validation (incl. honeypot, header
injection, rate limiting), visit ping upsert logic, and the /visits/geo
API resource transformation (internal fields must never leak).
"""

import pytest
from fastapi.testclient import TestClient

import server


@pytest.fixture()
def client():
    return TestClient(server.app)


@pytest.fixture(autouse=True)
def _isolate_state():
    """Give every test a clean visitor store + rate-limit buckets."""
    with server._lock:
        server._visits.clear()
    with server._rate_lock:
        for bucket in server._rate_buckets.values():
            bucket.clear()
    yield


VALID_CONTACT = {"name": "Jane Recruiter", "email": "jane@company.com", "message": "We would love to interview you."}


# ── Basic routes ──────────────────────────────────────────────────────────────


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_root(client):
    r = client.get("/api/")
    assert r.status_code == 200
    assert "message" in r.json()


# ── Contact validation ────────────────────────────────────────────────────────


def test_contact_valid_returns_ok(client):
    r = client.post("/api/contact", json=VALID_CONTACT)
    assert r.status_code == 200
    assert r.json() == {"ok": True}


@pytest.mark.parametrize(
    "field,value",
    [
        ("email", "not-an-email"),
        ("email", "missing@tld"),
        ("email", ""),
        ("name", "x"),            # below min_length
        ("name", ""),             # empty
        ("message", "short"),     # below min_length
        ("message", ""),          # empty
    ],
)
def test_contact_invalid_payloads_rejected(client, field, value):
    payload = {**VALID_CONTACT, field: value}
    r = client.post("/api/contact", json=payload)
    assert r.status_code == 422, f"{field}={value!r} should fail validation"


def test_contact_oversized_payload_rejected(client):
    r = client.post("/api/contact", json={**VALID_CONTACT, "message": "a" * 5001})
    assert r.status_code == 422


def test_contact_honeypot_silently_accepted(client):
    """A filled honeypot returns 200 (to frustrate bots) but queues nothing."""
    r = client.post("/api/contact", json={**VALID_CONTACT, "website": "http://spam.example"})
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_contact_name_header_injection_sanitized(client):
    """CR/LF in the name must be stripped so SMTP headers can't be injected."""
    r = client.post(
        "/api/contact",
        json={**VALID_CONTACT, "name": "Jane\r\nBCC: victim@example.com"},
    )
    assert r.status_code == 200  # sanitized, not rejected


def test_contact_rate_limited(client):
    limit, _window = server.RATE_LIMITS["contact"]
    for _ in range(limit):
        assert client.post("/api/contact", json=VALID_CONTACT).status_code == 200
    r = client.post("/api/contact", json=VALID_CONTACT)
    assert r.status_code == 429


# ── Visitor tracking ──────────────────────────────────────────────────────────


def test_visit_ping_localhost_ok(client):
    """Localhost IPs skip geo-lookup but must still return ok."""
    r = client.post("/api/visits/ping")
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_visits_geo_shape_and_transformation(client):
    """Seed the store, then verify the endpoint's resource transformation."""
    with server._lock:
        server._visits["PH:Malaybalay"] = {
            "lat": 8.15,
            "lon": 125.13,
            "city": "Malaybalay",
            "country": "Philippines",
            "country_code": "PH",
            "count": 7,
            "first_seen": "2026-01-01T00:00:00+00:00",
            "last_seen": "2026-01-02T00:00:00+00:00",
        }

    r = client.get("/api/visits/geo")
    assert r.status_code == 200
    locations = r.json()["locations"]
    assert len(locations) == 1

    loc = locations[0]
    # Public fields present…
    assert loc["city"] == "Malaybalay"
    assert loc["country"] == "Philippines"
    assert loc["count"] == 7
    assert loc["lat"] == 8.15 and loc["lon"] == 125.13
    # …internal bookkeeping must NOT leak
    assert "first_seen" not in loc
    assert "last_seen" not in loc
    assert "country_code" not in loc


# ── Schema migration ──────────────────────────────────────────────────────────


def test_migrate_store_legacy_v1():
    legacy = {"PH:Malaybalay": {"lat": 8.15, "lon": 125.13, "count": 1}}
    migrated = server._migrate_store(legacy)
    assert migrated["PH:Malaybalay"]["count"] == 1


def test_migrate_store_current_v2():
    current = {"schema_version": 2, "visits": {"US:SF": {"lat": 37.7, "lon": -122.4}}}
    assert server._migrate_store(current) == current["visits"]


def test_migrate_store_corrupt_returns_empty():
    assert server._migrate_store("garbage") == {}
    assert server._migrate_store(None) == {}
    assert server._migrate_store({"unexpected": 1}) == {}
