// src/components/portfolio/About.jsx
import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Reveal, SectionHead, EASE } from "./Section";
import { STATS, SKILL_BARS, TAG_GROUPS } from "../../data/portfolio";

const TAG_COLORS = {
  cyan: "border-cyan-400/30 text-cyan-200 bg-cyan-400/5",
  red: "border-red-400/30 text-red-300 bg-red-400/5",
  purple: "border-purple-400/30 text-purple-200 bg-purple-400/5",
  gold: "border-yellow-400/30 text-yellow-200 bg-yellow-400/5",
  green: "border-emerald-400/30 text-emerald-200 bg-emerald-400/5",
};

function CountUp({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full py-16 sm:py-20 lg:py-28 overflow-hidden"
      data-testid="about-section"
    >
      {/* Ambient — smaller/lighter on mobile so it can never contribute to overflow */}
      <div className="absolute right-0 top-1/3 w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-purple-500/5 blur-[80px] sm:blur-[130px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-5">
        <SectionHead
          index="01"
          eyebrow="Who I Am"
          title={<>Builder. Learner. <span className="text-cyan-300">Vibe Coder.</span></>}
        />

        {/*
          min-w-0 on both columns is the actual fix for the "broken on phone" bug.
          Grid/flex children default to min-width:auto, which means their own
          intrinsic (unwrapped) content width can force the track wider than the
          viewport — even with .truncate / overflow-hidden on the children,
          because white-space:nowrap contributes full width to layout regardless
          of overflow settings. That's what was pushing the whole section wider
          than the phone screen and cropping the stat cards / code block text.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mt-8 sm:mt-10 lg:mt-0">
          {/* Left column */}
          <div className="min-w-0">
            <Reveal>
              {/* Graduation badge — full width on phones so the two-line text has room */}
              <div className="flex items-center gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/5 px-3 sm:px-4 py-2.5 sm:py-3 mb-5 sm:mb-6 w-full sm:w-auto sm:inline-flex">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-yellow-200">
                    BSIT Graduate — Class of 2026
                  </p>
                  <p className="font-mono2 text-[10px] sm:text-[11px] text-slate-500 break-words">
                    Bukidnon State University · Milestone unlocked
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-slate-400 text-[13px] sm:text-base leading-relaxed break-words">
                <p>
                  I'm <strong className="text-slate-200">John Symaiah M. Dagooc</strong>, a freshly
                  minted <strong className="text-slate-200">BSIT graduate</strong> from{" "}
                  <strong className="text-slate-200">Bukidnon State University</strong> who secures
                  networks by day and ships full-stack web, mobile, and AI projects the rest of the time.
                </p>
                <p>
                  Whether it's a Laravel backend with clean REST APIs, a React/Capacitor app packaged
                  for Android, a fine-tuned model, or a Cisco network topology, I bring the same
                  energy: figure it out fast, make it work, make it elegant.
                </p>
                <p>
                  My real-world training as a{" "}
                  <strong className="text-slate-200">System Integrator Trainee</strong> at Project
                  Moonshot IT Solutions taught me to read a system end to end — gathering requirements,
                  spotting bottlenecks, and revising workflows as things change.
                </p>
              </div>
            </Reveal>

            {/* Stats grid — always 2 cols on phones, 4 from sm up; tighter type so labels never wrap into overflow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-7 sm:mt-10">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.07}>
                  <motion.div
                    data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                    whileHover={{ scale: 1.04, borderColor: s.gold ? "rgba(250,204,21,0.4)" : "rgba(0,240,255,0.35)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass border border-cyan-500/15 rounded-xl px-2 py-3 sm:p-4 text-center min-w-0"
                  >
                    <div
                      className={`font-display text-lg sm:text-2xl lg:text-3xl font-black ${
                        s.gold ? "text-yellow-300" : "text-cyan-300"
                      }`}
                    >
                      <CountUp value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="font-mono2 text-[8px] sm:text-[10px] tracking-wide sm:tracking-widest uppercase text-slate-500 mt-0.5 sm:mt-1 leading-tight break-words">
                      {s.label}
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>

            {/* Skill bars */}
            <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5 w-full">
              {SKILL_BARS.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.05}>
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-3 font-mono2 text-[10px] sm:text-xs text-slate-400 mb-1 sm:mb-1.5">
                      <span className="truncate min-w-0 flex-1">{s.name}</span>
                      <span
                        className={`shrink-0 tabular-nums ${s.gold ? "text-yellow-300" : "text-cyan-300"}`}
                      >
                        {s.pct}%
                      </span>
                    </div>
                    <div className="h-2 sm:h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
                        className={`h-full rounded-full relative overflow-hidden ${
                          s.gold
                            ? "bg-gradient-to-r from-yellow-500 to-amber-300"
                            : "bg-gradient-to-r from-cyan-400 to-blue-600"
                        }`}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "200%" }}
                          transition={{ duration: 1.5, delay: 1.4 + i * 0.1, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="min-w-0">
            <Reveal delay={0.1}>
              {/* Code block — scrollable on mobile to prevent overflow */}
              <div className="glass border border-cyan-500/20 rounded-xl overflow-hidden mb-6 sm:mb-8 w-full max-w-full">
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="p-3.5 sm:p-5 font-mono2 text-[10.5px] sm:text-[12px] lg:text-[13px] leading-relaxed overflow-x-auto max-w-full">
                  <div className="min-w-0">
                    <span className="text-purple-300">const</span>{" "}
                    <span className="text-cyan-300">dev</span>{" "}
                    <span className="text-slate-500">= {"{"}</span>
                    <div className="pl-3 sm:pl-4 text-slate-400">
                      <div className="truncate">name: <span className="text-cyan-200">"John Symaiah M. Dagooc"</span>,</div>
                      <div className="truncate">role: <span className="text-cyan-200">"Full-Stack Developer & Systems Integrator"</span>,</div>
                      <div className="truncate">status: <span className="text-yellow-300">"BSIT Graduate · 2026"</span>,</div>
                      <div className="truncate">stack: [<span className="text-purple-300">"Laravel", "React", "Firebase"</span>],</div>
                      <div className="truncate">certs: [<span className="text-purple-300">"CCNA ITN", "CCNA SRWE"</span>],</div>
                      <div className="truncate">motto: <span className="text-cyan-200">"Code. Ship. Rep."</span></div>
                    </div>
                    <span className="text-slate-500">{"};"}</span>
                    <div className="text-slate-600 mt-1 text-[9.5px] sm:text-[11px] truncate">
                      {"// Shipping real systems for Philippine businesses & BukSU."}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Tag groups */}
            {TAG_GROUPS.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.06}>
                <div className="mb-5 sm:mb-6">
                  <div className="font-mono2 text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-slate-500 mb-2 sm:mb-2.5">
                    {g.title}
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {g.tags.map((t) => (
                      <motion.span
                        key={t}
                        whileHover={{ scale: 1.06 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className={`rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 font-mono2 text-[10px] sm:text-[11px] ${TAG_COLORS[g.color]} cursor-default`}
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}