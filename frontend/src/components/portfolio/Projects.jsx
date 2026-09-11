import { motion } from "framer-motion";
import { HardHat, Truck, CalendarCheck, Github, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./Section";
import { PROJECTS } from "../../data/portfolio";

const ICONS = { helmet: HardHat, truck: Truck, calendar: CalendarCheck };

export default function Projects() {
  return (
    <section id="projects" className="relative py-20 sm:py-28 overflow-hidden" data-testid="projects-section">
      {/* Ambient glow */}
      <div className="absolute right-0 bottom-1/3 w-96 h-96 rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <SectionHead
          index="04"
          eyebrow="Portfolio"
          title="Projects"
          sub="Full-stack systems I've built and shipped — marketplace, fleet management, and booking."
        />

        {/* Grid: 1 col on xs, 2 col on sm, 3 col on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {PROJECTS.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <motion.article
                  data-testid={`project-card-${i}`}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  className="group h-full glass border border-cyan-500/15 rounded-2xl overflow-hidden hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(0,114,255,0.15)] transition-all flex flex-col"
                >
                  {/* Card header / icon area */}
                  <div className="relative h-32 sm:h-40 bg-gradient-to-br from-[#0a0e17] via-[#0d1526] to-[#120a24] flex items-center justify-center overflow-hidden border-b border-cyan-500/10">
                    {/* Grid background */}
                    <div
                      className="absolute inset-0 opacity-[0.13]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    {/* Glow behind icon */}
                    <div className="absolute w-20 h-20 rounded-full bg-cyan-500/20 blur-[30px] group-hover:bg-cyan-500/30 transition-all duration-500" />
                    <Icon className="relative w-10 h-10 sm:w-12 sm:h-12 text-cyan-300 drop-shadow-[0_0_14px_rgba(0,240,255,0.6)] transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  {/* Card body */}
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <h3 className="font-display text-base sm:text-xl font-bold text-white mb-1.5 sm:mb-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed flex-1">{p.desc}</p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-3 sm:mt-4">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-cyan-400/25 bg-cyan-400/5 px-2 sm:px-2.5 py-0.5 font-mono2 text-[9px] sm:text-[10px] text-cyan-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/5">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          data-testid={`project-${i}-link-${l.label.toLowerCase()}`}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 sm:gap-1.5 font-mono2 text-[10px] sm:text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          {l.label === "Code" ? (
                            <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          )}
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
