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
    <section id="about" className="relative py-28" data-testid="about-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead index="01" eyebrow="Who I Am" title={<>Builder. Learner. <span className="text-cyan-300">Vibe Coder.</span></>} />
        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/5 px-4 py-3 mb-6">
                <GraduationCap className="w-5 h-5 text-yellow-300" />
                <div>
                  <p className="text-sm font-semibold text-yellow-200">BSIT Graduate — Class of 2026</p>
                  <p className="font-mono2 text-[11px] text-slate-500">Bukidnon State University · Milestone unlocked</p>
                </div>
              </div>
              <div className="space-y-4 text-slate-400 text-sm sm:text-base leading-relaxed">
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
                  Moonshot IT Solutions taught me to read a system end to end — gathering
                  requirements, spotting bottlenecks, and revising workflows as things change.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.07}>
                  <div
                    data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="glass border border-cyan-500/15 rounded-xl p-4 text-center"
                  >
                    <div className={`font-display text-2xl sm:text-3xl font-black ${s.gold ? "text-yellow-300" : "text-cyan-300"}`}>
                      <CountUp value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="font-mono2 text-[10px] tracking-widest uppercase text-slate-500 mt-1">
                      {s.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 space-y-5">
              {SKILL_BARS.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.05}>
                  <div>
                    <div className="flex justify-between font-mono2 text-xs text-slate-400 mb-1.5">
                      <span>{s.name}</span>
                      <span className={s.gold ? "text-yellow-300" : "text-cyan-300"}>{s.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
                        className={`h-full rounded-full ${
                          s.gold
                            ? "bg-gradient-to-r from-yellow-500 to-amber-300"
                            : "bg-gradient-to-r from-cyan-400 to-blue-600"
                        }`}
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <Reveal delay={0.1}>
              <div className="glass border border-cyan-500/20 rounded-xl overflow-hidden mb-8">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="p-5 font-mono2 text-[12px] sm:text-[13px] leading-relaxed">
                  <span className="text-purple-300">const</span> <span className="text-cyan-300">dev</span>{" "}
                  <span className="text-slate-500">= {"{"}</span>
                  <div className="pl-4 text-slate-400">
                    <div>name: <span className="text-cyan-200">"John Symaiah M. Dagooc"</span>,</div>
                    <div>role: <span className="text-cyan-200">"Full-Stack Developer & Systems Integrator"</span>,</div>
                    <div>status: <span className="text-yellow-300">"BSIT Graduate · 2026"</span>,</div>
                    <div>stack: [<span className="text-purple-300">"Laravel", "React", "Firebase", "Express"</span>],</div>
                    <div>certs: [<span className="text-purple-300">"CCNA ITN", "CCNA SRWE"</span>],</div>
                    <div>motto: <span className="text-cyan-200">"Code. Ship. Rep."</span></div>
                  </div>
                  <span className="text-slate-500">{"};"}</span>
                  <div className="text-slate-600 mt-1">{"// Shipping real systems for Philippine businesses & BukSU."}</div>
                </div>
              </div>
            </Reveal>

            {TAG_GROUPS.map((g, gi) => (
              <Reveal key={g.title} delay={gi * 0.06}>
                <div className="mb-6">
                  <div className="font-mono2 text-[11px] tracking-[0.25em] uppercase text-slate-500 mb-2.5">
                    {g.title}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full border px-3 py-1 font-mono2 text-[11px] ${TAG_COLORS[g.color]}`}
                      >
                        {t}
                      </span>
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
