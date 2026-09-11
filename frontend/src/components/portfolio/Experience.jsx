import { GraduationCap, Building2, GitBranch, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./Section";
import { TIMELINE } from "../../data/portfolio";

const ICONS = { grad: GraduationCap, building: Building2, branch: GitBranch };

export default function Experience() {
  return (
    <section id="experience" className="relative py-20 sm:py-28 overflow-hidden" data-testid="experience-section">
      {/* Subtle ambient */}
      <div className="absolute left-0 top-1/2 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <SectionHead
          index="03"
          eyebrow="Track Record"
          title="Experience & Education"
          sub="A BSIT degree in hand, real training on the resume, and the systems I've shipped along the way."
        />

        {/* Timeline container — tighter on mobile */}
        <div className="relative pl-6 sm:pl-10">
          {/* Vertical line */}
          <div className="absolute left-[5px] sm:left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/60 via-purple-500/40 to-transparent" />

          <div className="space-y-8 sm:space-y-10">
            {TIMELINE.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="relative" data-testid={`timeline-item-${i}`}>
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-6 sm:-left-10 top-4 sm:top-5 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${
                        item.graduate
                          ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_14px_rgba(255,215,0,0.5)]"
                          : "border-cyan-400 bg-cyan-400/20 shadow-[0_0_14px_rgba(0,240,255,0.4)]"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                          item.graduate ? "bg-yellow-300" : "bg-cyan-300"
                        }`}
                      />
                    </div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ borderColor: item.graduate ? "rgba(250,204,21,0.4)" : "rgba(0,240,255,0.35)" }}
                      className={`glass rounded-2xl border p-4 sm:p-6 transition-shadow hover:shadow-[0_0_30px_rgba(0,114,255,0.1)] ${
                        item.graduate ? "border-yellow-400/25" : "border-cyan-500/15"
                      }`}
                    >
                      {/* Header row — stack on very small screens */}
                      <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-start xs:justify-between gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <Icon
                            className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                              item.graduate ? "text-yellow-300" : "text-cyan-300"
                            }`}
                          />
                          <h3 className="font-display text-base sm:text-lg lg:text-xl font-bold text-white leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <span
                          className={`self-start rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono2 text-[9px] sm:text-[10px] tracking-widest uppercase shrink-0 ${
                            item.graduate
                              ? "border-yellow-400/50 text-yellow-300 bg-yellow-400/10 text-glow-gold"
                              : "border-cyan-400/40 text-cyan-300 bg-cyan-400/5"
                          }`}
                        >
                          {item.date}
                        </span>
                      </div>

                      <div className="font-mono2 text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                        {item.org}
                      </div>

                      <ul className="space-y-1.5 sm:space-y-2">
                        {item.points.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed"
                          >
                            <Check
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 sm:mt-1 shrink-0 ${
                                item.graduate ? "text-yellow-400" : "text-cyan-400"
                              }`}
                            />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
