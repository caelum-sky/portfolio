import {
  Star,
  TrendingUp,
  Award,
  Network,
  Server,
  ShieldCheck,
  Lock,
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import { Reveal, SectionHead } from "./Section";
import { ACHIEVEMENTS, CERTIFICATIONS } from "../../data/portfolio";

const ACH_ICONS = { star: Star, chart: TrendingUp, award: Award, network: Network };
const CERT_ICONS = { network: Network, server: Server, shield: ShieldCheck, lock: Lock };

export function Achievements() {
  return (
    <section id="achievements" className="relative py-28" data-testid="achievements-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          index="05"
          eyebrow="Recognition"
          title="Achievements"
          sub="Milestones earned alongside the coursework and the shipped projects."
        />
        <div className="grid sm:grid-cols-2 gap-5">
          {ACHIEVEMENTS.map((a, i) => {
            const Icon = ACH_ICONS[a.icon];
            return (
              <Reveal key={a.title} delay={i * 0.07}>
                <div
                  data-testid={`achievement-card-${i}`}
                  className="flex items-start gap-4 glass border border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-colors"
                >
                  <div className="w-11 h-11 shrink-0 rounded-xl border border-yellow-400/40 bg-yellow-400/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-white mb-1">{a.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section id="certifications" className="relative py-28" data-testid="certifications-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          index="06"
          eyebrow="Credentials"
          title="Certifications"
          sub="Cisco Networking Academy certifications completed as part of the CCNAv7 curriculum."
        />
        <div className="grid sm:grid-cols-2 gap-5">
          {CERTIFICATIONS.map((c, i) => {
            const Icon = CERT_ICONS[c.icon];
            return (
              <Reveal key={c.title} delay={i * 0.06}>
                <div
                  data-testid={`certification-card-${i}`}
                  className="h-full glass border border-cyan-500/15 rounded-2xl p-6 flex flex-col hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-white leading-snug">{c.title}</h3>
                      <div className="font-mono2 text-[11px] text-slate-500 mt-1">{c.issuer}</div>
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    {c.meta.map((m, mi) => (
                      <div key={m} className="flex items-center gap-2 text-xs text-slate-400">
                        {mi === 0 && !c.pending ? (
                          <CalendarCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : mi === c.meta.length - 1 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                    <span
                      className={`rounded-full border px-3 py-1 font-mono2 text-[10px] tracking-widest uppercase ${
                        c.pending
                          ? "border-slate-500/40 text-slate-400"
                          : "border-cyan-400/50 text-cyan-300 bg-cyan-400/10"
                      }`}
                    >
                      {c.badge}
                    </span>
                    {c.download && (
                      <a
                        data-testid={`cert-download-${i}`}
                        href={c.download}
                        download={c.downloadName}
                        className="inline-flex items-center gap-1.5 font-mono2 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Certificate
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
