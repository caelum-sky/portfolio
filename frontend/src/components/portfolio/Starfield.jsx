import { useEffect, useRef } from "react";

export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w;
    let h;
    let stars = [];

    const seed = () => {
      const count = Math.min(260, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: 0.02 + Math.random() * 0.08,
        drift: 0.02 + Math.random() * 0.06,
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        s.tw += s.sp;
        s.y += s.drift;
        if (s.y > h + 2) s.y = -2;
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.tw));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#cfe9ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[38rem] h-[38rem] rounded-full bg-purple-600/10 blur-[160px]" />
      <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[150px]" />
    </div>
  );
}
