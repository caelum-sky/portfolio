import { motion } from "framer-motion";
import { Wand2, Layers, Smartphone, Brain, ShieldCheck, GitBranch } from "lucide-react";
import { Reveal, SectionHead } from "./Section";
import { DISCIPLINES } from "../../data/portfolio";

const ICONS = {
  wand: Wand2,
  layers: Layers,
  mobile: Smartphone,
  brain: Brain,
  shield: ShieldCheck,
  diagram: GitBranch,
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-20 sm:py-28 overflow-hidden" data-testid="skills-section">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-cyan-500/4 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <SectionHead
          index="02"
          eyebrow="What I Build"
          title="Core Disciplines"
          sub="From spinning up a Laravel API to packaging an Android build to configuring a Cisco topology — here's what I actually do."
        />

        {/* Grid: 1 col on mobile, 2 on sm, 3 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {DISCIPLINES.map((d, i) => {
            const Icon = ICONS[d.icon];
            return (
              <Reveal key={d.title} delay={i * 0.06}>
                <motion.div
                  data-testid={`discipline-card-${i}`}
                  whileHover={{ y: -5, borderColor: "rgba(0,240,255,0.45)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="group h-full glass border border-cyan-500/15 rounded-2xl p-5 sm:p-6 hover:shadow-[0_0_40px_rgba(0,240,255,0.12)] transition-shadow"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:shadow-[0_0_18px_rgba(0,240,255,0.4)] group-hover:border-cyan-400/60 transition-all">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-cyan-300" />
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">
                    {d.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                    {d.desc}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {d.techs.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-white/10 bg-white/[0.04] px-1.5 sm:px-2 py-0.5 font-mono2 text-[9px] sm:text-[10px] text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
