import { MARQUEE_ITEMS } from "../../data/portfolio";

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div
      className="relative border-y border-cyan-500/15 bg-white/[0.02] py-4 sm:py-5 overflow-hidden"
      aria-hidden="true"
      data-testid="skills-marquee"
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#030509] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#030509] to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex whitespace-nowrap w-max">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-slate-600 hover:text-slate-400 transition-colors px-5 sm:px-6 tracking-tight">
              {item}
            </span>
            <span className="text-cyan-400/50 text-xs sm:text-sm">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
