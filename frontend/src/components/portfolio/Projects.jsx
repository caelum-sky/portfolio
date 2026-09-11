import { motion } from "framer-motion";
import { HardHat, Truck, CalendarCheck, Github, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHead } from "./Section";
import { PROJECTS } from "../../data/portfolio";

const ICONS = { helmet: HardHat, truck: Truck, calendar: CalendarCheck };

export default function Projects() {
  return (
    <section id="projects" className="relative py-28" data-testid="projects-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          index="04"
          eyebrow="Portfolio"
          title="Projects"
          sub="Full-stack systems I've built and shipped — marketplace, fleet management, and booking."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <Reveal key={p.title} delay={i * 0.08} className={i === 0 ? "md:row-span-1" : ""}>
                <motion.article
                  data-testid={`project-card-${i}`}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  className="group h-full glass border border-cyan-500/15 rounded-2xl overflow-hidden hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(0,114,255,0.15)] transition-colors flex flex-col"
                >
                  <div className="relative h-40 bg-gradient-to-br from-[#0a0e17] via-[#0d1526] to-[#120a24] flex items-center justify-center overflow-hidden border-b border-cyan-500/10">
                    <div
                      className="absolute inset-0 opacity-[0.13]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />
                    <Icon className="relative w-12 h-12 text-cyan-300 drop-shadow-[0_0_14px_rgba(0,240,255,0.6)] transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-1">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-cyan-400/25 bg-cyan-400/5 px-2.5 py-0.5 font-mono2 text-[10px] text-cyan-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-5 pt-4 border-t border-white/5">
                      {p.links.map((l) => (
                        <a
                          key={l.label}
                          data-testid={`project-${i}-link-${l.label.toLowerCase()}`}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono2 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          {l.label === "Code" ? (
                            <Github className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
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
