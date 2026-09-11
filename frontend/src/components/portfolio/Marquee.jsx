import { MARQUEE_ITEMS } from "../../data/portfolio";

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="relative border-y border-cyan-500/15 bg-white/[0.02] py-5 overflow-hidden"
      aria-hidden="true"
      data-testid="skills-marquee"
    >
      <div className="marquee-track flex whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="font-display text-xl sm:text-2xl font-bold text-slate-600 px-6 tracking-tight">
              {item}
            </span>
            <span className="text-cyan-400/60 text-sm">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
