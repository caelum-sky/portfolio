import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, className = "", y = 32 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ index, eyebrow, title, sub }) {
  return (
    <div className="relative mb-12 sm:mb-14 overflow-hidden" data-testid={`section-head-${index}`}>
      {/* Background outline number — clipped so it never causes horizontal scroll */}
      <span
        aria-hidden="true"
        className="outline-text font-display absolute -top-6 sm:-top-10 -left-1 sm:-left-2 text-[5rem] sm:text-[7rem] lg:text-[9rem] font-black leading-none select-none pointer-events-none"
      >
        {index}
      </span>
      <Reveal>
        <div className="relative flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 pt-4">
          <span className="font-mono2 text-xs sm:text-sm text-cyan-400">{index} /</span>
          <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-cyan-400/60 to-transparent" />
          <span className="font-mono2 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-slate-500">
            {eyebrow}
          </span>
        </div>
        <h2 className="relative font-display text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {title}
        </h2>
        {sub && (
          <p className="relative text-slate-400 text-sm sm:text-base mt-2 sm:mt-3 max-w-2xl leading-relaxed">
            {sub}
          </p>
        )}
      </Reveal>
    </div>
  );
}
