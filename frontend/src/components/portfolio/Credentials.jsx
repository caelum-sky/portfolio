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
import { motion } from "framer-motion";
import { Reveal, SectionHead } from "./Section";
import { ACHIEVEMENTS, CERTIFICATIONS } from "../../data/portfolio";

const ACH_ICONS = { star: Star, chart: TrendingUp, award: Award, network: Network };
const CERT_ICONS = { network: Network, server: Server, shield: ShieldCheck, lock: Lock };

export function Achievements() {
  return (
    <section id="achievements" className="relative py-20 sm:py-28 overflow-hidden" data-testid="achievements-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <SectionHead
          index="05"
          eyebrow="Recognition"
          title="Achievements"
          sub="Milestones earned alongside the coursework and the shipped projects."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {ACHIEVEMENTS.map((a, i) => {
            const Icon = ACH_ICONS[a.icon];
            return (
              <Reveal key={a.title} delay={i * 0.07}>
                <motion.div
                  data-testid={`achievement-card-${i}`}
                  whileHover={{ borderColor: "rgba(250,204,21,0.5)", y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex items-start gap-3 sm:gap-4 glass border border-yellow-400/20 rounded-2xl p-4 sm:p-6 hover:shadow-[0_0_30px_rgba(255,215,0,0.08)] transition-shadow"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl border border-yellow-400/40 bg-yellow-400/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display text-sm sm:text-base font-bold text-white mb-1 leading-snug">
                      {a.title}
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{a.desc}</p>
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

export function Certifications() {
  return (
    <section id="certifications" className="relative py-20 sm:py-28 overflow-hidden" data-testid="certifications-section">
      {/* Ambient */}
      <div className="absolute right-0 top-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-5">
        <SectionHead
          index="06"
          eyebrow="Credentials"
          title="Certifications"
          sub="Cisco Networking Academy certifications completed as part of the CCNAv7 curriculum."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {CERTIFICATIONS.map((c, i) => {
            const Icon = CERT_ICONS[c.icon];
            return (
              <Reveal key={c.title} delay={i * 0.06}>
                <motion.div
                  data-testid={`certification-card-${i}`}
                  whileHover={{ borderColor: "rgba(0,240,255,0.4)", y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="h-full glass border border-cyan-500/15 rounded-2xl p-4 sm:p-6 flex flex-col hover:shadow-[0_0_35px_rgba(0,114,255,0.1)] transition-shadow"
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
                        {c.title}
                      </h3>
                      <div className="font-mono2 text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1">
                        {c.issuer}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 flex-1">
                    {c.meta.map((m, mi) => (
                      <div key={m} className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
                        {mi === 0 && !c.pending ? (
                          <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                        ) : mi === c.meta.length - 1 ? (
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span className="leading-snug">{m}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/5">
                    <span
                      className={`rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono2 text-[9px] sm:text-[10px] tracking-widest uppercase ${
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
                        className="inline-flex items-center gap-1 sm:gap-1.5 font-mono2 text-[10px] sm:text-xs text-slate-300 hover:text-cyan-300 transition-colors active:scale-95"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Certificate
                      </a>
                    )}
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
