import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, className = "", y = 36 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ index, eyebrow, title, sub }) {
  return (
    <div className="relative mb-14" data-testid={`section-head-${index}`}>
      <span
        aria-hidden="true"
        className="outline-text font-display absolute -top-10 -left-2 text-[7rem] sm:text-[9rem] font-black leading-none select-none pointer-events-none"
      >
        {index}
      </span>
      <Reveal>
        <div className="relative flex items-center gap-4 mb-4">
          <span className="font-mono2 text-sm text-cyan-400">{index} /</span>
          <span className="h-px w-16 bg-gradient-to-r from-cyan-400/60 to-transparent" />
          <span className="font-mono2 text-xs tracking-[0.3em] uppercase text-slate-500">
            {eyebrow}
          </span>
        </div>
        <h2 className="relative font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          {title}
        </h2>
        {sub && <p className="relative text-slate-400 text-sm sm:text-base mt-3 max-w-2xl">{sub}</p>}
      </Reveal>
    </div>
  );
}
