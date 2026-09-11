import { GraduationCap, Building2, GitBranch, Check } from "lucide-react";
import { Reveal, SectionHead } from "./Section";
import { TIMELINE } from "../../data/portfolio";

const ICONS = { grad: GraduationCap, building: Building2, branch: GitBranch };

export default function Experience() {
  return (
    <section id="experience" className="relative py-28" data-testid="experience-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          index="03"
          eyebrow="Track Record"
          title="Experience & Education"
          sub="A BSIT degree in hand, real training on the resume, and the systems I've shipped along the way."
        />
        <div className="relative pl-8 sm:pl-12">
          <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/60 via-purple-500/40 to-transparent" />
          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="relative" data-testid={`timeline-item-${i}`}>
                    <div
                      className={`absolute -left-8 sm:-left-12 top-1 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                        item.graduate
                          ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_16px_rgba(255,215,0,0.5)]"
                          : "border-cyan-400 bg-cyan-400/20 shadow-[0_0_16px_rgba(0,240,255,0.4)]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.graduate ? "bg-yellow-300" : "bg-cyan-300"}`} />
                    </div>
                    <div
                      className={`glass rounded-2xl border p-6 sm:p-7 ${
                        item.graduate ? "border-yellow-400/25" : "border-cyan-500/15"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${item.graduate ? "text-yellow-300" : "text-cyan-300"}`} />
                          <h3 className="font-display text-lg sm:text-xl font-bold text-white">{item.title}</h3>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 font-mono2 text-[10px] tracking-widest uppercase ${
                            item.graduate
                              ? "border-yellow-400/50 text-yellow-300 bg-yellow-400/10 text-glow-gold"
                              : "border-cyan-400/40 text-cyan-300 bg-cyan-400/5"
                          }`}
                        >
                          {item.date}
                        </span>
                      </div>
                      <div className="font-mono2 text-xs text-slate-500 mb-4">{item.org}</div>
                      <ul className="space-y-2">
                        {item.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed">
                            <Check className="w-3.5 h-3.5 mt-1 shrink-0 text-cyan-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
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
