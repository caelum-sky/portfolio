import { useEffect, useRef, useState } from "react";

const API = (import.meta.env.VITE_BACKEND_URL || "") + "/api";

export default function FooterGlobe() {
  const ref = useRef(null);
  const [locs, setLocs] = useState([]);

  useEffect(() => {
    fetch(`${API}/visits/geo`)
      .then((r) => r.json())
      .then((d) => setLocs(d.locations || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = 88;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = S / 2;
    const cy = S / 2;
    const R = S / 2 - 6;

    const toXYZ = (lat, lon, rot) => {
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180 + rot;
      return {
        x: Math.cos(la) * Math.sin(lo),
        y: Math.sin(la),
        z: Math.cos(la) * Math.cos(lo),
      };
    };

    let rot = 0;
    let raf;

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      rot += 0.008;

      // Globe glow
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
      g.addColorStop(0, "rgba(0,240,255,0.10)");
      g.addColorStop(1, "rgba(0,20,40,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = "rgba(0,240,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const p = toXYZ(lat, 0, 0);
        const r = Math.cos((lat * Math.PI) / 180) * R;
        ctx.strokeStyle = "rgba(0,240,255,0.14)";
        ctx.beginPath();
        ctx.ellipse(cx, cy - p.y * R, r, r * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines (rotating)
      for (let lon = 0; lon < 180; lon += 30) {
        const front = Math.cos(rot + (lon * Math.PI) / 180);
        const rx = Math.abs(Math.sin(rot + (lon * Math.PI) / 180)) * R;
        ctx.strokeStyle = `rgba(0,240,255,${0.05 + Math.abs(front) * 0.1})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(rx, 0.5), R, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Visitor dots
      const t = performance.now() / 1000;
      locs.forEach((l, i) => {
        const p = toXYZ(l.lat, l.lon, rot);
        if (p.z < 0) return; // back-face culling
        const x = cx + p.x * R;
        const y = cy - p.y * R;
        const pulse = 1.6 + Math.sin(t * 3 + i) * 0.7 + Math.min(l.count, 8) * 0.25;
        ctx.fillStyle = "rgba(255,215,0,0.95)";
        ctx.shadowColor = "rgba(255,215,0,0.9)";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [locs]);

  const title = locs.length
    ? `Visitors from: ${locs
        .slice(0, 6)
        .map((l) => `${l.city}, ${l.country}`)
        .join(" · ")}`
    : "Awaiting first visitor pings";

  return (
    <div className="flex flex-col items-center gap-1" title={title} data-testid="visitor-globe">
      <canvas ref={ref} aria-label={title} />
      <span className="font-mono2 text-[9px] tracking-[0.25em] uppercase text-slate-600">
        {locs.length ? `${locs.length} origin${locs.length === 1 ? "" : "s"}` : "listening…"}
      </span>
    </div>
  );
}
