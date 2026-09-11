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
    <section id="skills" className="relative py-28" data-testid="skills-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          index="02"
          eyebrow="What I Build"
          title="Core Disciplines"
          sub="From spinning up a Laravel API to packaging an Android build to configuring a Cisco topology — here's what I actually do."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISCIPLINES.map((d, i) => {
            const Icon = ICONS[d.icon];
            return (
              <Reveal key={d.title} delay={i * 0.06}>
                <motion.div
                  data-testid={`discipline-card-${i}`}
                  whileHover={{ y: -6, borderColor: "rgba(0,240,255,0.45)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="group h-full glass border border-cyan-500/15 rounded-2xl p-6 hover:shadow-[0_0_40px_rgba(0,240,255,0.12)] transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center mb-5 group-hover:shadow-[0_0_18px_rgba(0,240,255,0.4)] transition-shadow">
                    <Icon className="w-5 h-5 text-cyan-300" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{d.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{d.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.techs.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono2 text-[10px] text-slate-400"
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
