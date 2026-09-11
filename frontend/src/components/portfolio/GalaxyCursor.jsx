import { useEffect, useRef } from "react";

export default function GalaxyCursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: w / 2, y: h / 2 };
    const pos = { x: w / 2, y: h / 2 };
    let hover = false;
    const stars = [];
    const arms = [];
    for (let i = 0; i < 70; i += 1) {
      arms.push({
        t: Math.random(),
        arm: i % 2,
        off: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.6 + 0.4,
        hue: Math.random() < 0.7 ? 187 : 280,
        speed: 0.15 + Math.random() * 0.2,
      });
    }

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      hover =
        e.target instanceof Element &&
        !!e.target.closest("a,button,input,textarea,select,[data-hoverable]");
      const n = hover ? 4 : 2;
      for (let i = 0; i < n; i += 1) {
        stars.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.2,
          life: 1,
          decay: 0.012 + Math.random() * 0.02,
          size: Math.random() * 1.8 + 0.4,
          hue: [187, 265, 45, 210][Math.floor(Math.random() * 4)],
          tw: Math.random() * Math.PI * 2,
        });
      }
      if (stars.length > 220) stars.splice(0, stars.length - 220);
    };
    window.addEventListener("mousemove", onMove);

    let rot = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pos.x += (mouse.x - pos.x) * 0.2;
      pos.y += (mouse.y - pos.y) * 0.2;
      rot += 0.012;
      ctx.globalCompositeOperation = "lighter";

      for (let i = stars.length - 1; i >= 0; i -= 1) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) {
          stars.splice(i, 1);
          continue;
        }
        s.tw += 0.15;
        const tw = 0.6 + 0.4 * Math.sin(s.tw);
        ctx.globalAlpha = s.life * tw;
        ctx.fillStyle = `hsl(${s.hue} 100% 75%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life + 0.3, 0, 7);
        ctx.fill();
      }

      const R = hover ? 36 : 27;
      const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, R);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(0.15, "rgba(0,240,255,0.55)");
      g.addColorStop(0.45, "rgba(168,85,247,0.28)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, R, 0, 7);
      ctx.fill();

      for (let i = 0; i < arms.length; i += 1) {
        const p = arms[i];
        const a = rot * p.speed * 6 + p.arm * Math.PI + p.t * 4.2 + p.off;
        const r = 2 + p.t * (hover ? 25 : 18);
        const x = pos.x + Math.cos(a) * r * 1.25;
        const y = pos.y + Math.sin(a) * r * 0.55;
        ctx.globalAlpha = (1 - p.t) * 0.8 + 0.15;
        ctx.fillStyle = `hsl(${p.hue} 100% ${70 + p.t * 20}%)`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * (1 - p.t * 0.6), 0, 7);
        ctx.fill();
      }

      if (hover) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "rgba(0,240,255,0.9)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 32 + Math.sin(rot * 6) * 2, 0, 7);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <canvas
      ref={ref}
      data-testid="galaxy-cursor"
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
}
