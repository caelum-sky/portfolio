import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FileDown, Terminal, Rocket } from "lucide-react";
import { GREETINGS, CHIPS, PROFILE_IMG } from "../../data/portfolio";

const EASE = [0.22, 1, 0.36, 1];

const MaskLine = ({ show, delay, children, className = "" }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: "115%" }}
      animate={show ? { y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  </div>
);

const TERMINAL_LINES = [
  { k: '"name"', v: '"John Symaiah M. Dagooc"' },
  { k: '"role"', v: '"Full-Stack & AI Developer"' },
  { k: '"status"', v: '"BSIT Graduate · 2026"' },
  { k: '"stack"', v: '["Laravel", "React", "Firebase"]' },
  { k: '"ai"', v: '["PyTorch", "HuggingFace"]' },
  { k: '"certs"', v: '["CCNA ITN", "CCNA SRWE"]' },
  { k: '"vibe"', v: '"ship fast, ship clean"' },
];

function GreetingRotator({ show }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!show) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % GREETINGS.length), 2600);
    return () => clearInterval(t);
  }, [show]);
  return (
    <div
      data-testid="greeting-rotator"
      className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-1.5 font-mono2 text-xs sm:text-sm text-cyan-300 tracking-widest h-9 overflow-hidden"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.span
          key={GREETINGS[idx]}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {GREETINGS[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function CircuitBoard() {
  return (
    <svg
      data-testid="circuit-board"
      viewBox="0 0 520 640"
      className="absolute inset-0 w-full h-full opacity-60"
      aria-hidden="true"
    >
      <path className="trace flow" d="M10,70 H190 V210 H360 V60 H510" />
      <path className="trace" d="M30,330 H170 V430 H310 V570 H500" />
      <path className="trace alt" d="M500,120 H370 V260 H210 V350" />
      <path className="trace alt flow" d="M60,610 H230 V500 H410" />
      <path className="trace" d="M10,470 H130 V540 H270" />
      {[
        [190, 70, 0], [190, 210, 0], [360, 210, 1], [170, 330, 0], [170, 430, 0],
        [310, 430, 1], [370, 120, 1], [370, 260, 1], [230, 610, 0], [230, 500, 0],
        [130, 470, 0], [130, 540, 0],
      ].map(([cx, cy, alt]) => (
        <circle key={`${cx}-${cy}`} className={`node ${alt ? "alt" : ""}`} cx={cx} cy={cy} r="3" />
      ))}
    </svg>
  );
}

function TerminalCard({ show }) {
  return (
    <div
      data-testid="hero-terminal"
      className="relative glass border border-cyan-500/25 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,114,255,0.15)]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono2 text-[11px] text-slate-500">~/john-dagooc — bash</span>
      </div>
      <div className="p-5 font-mono2 text-[12px] sm:text-[13px] leading-relaxed">
        <div className="text-slate-300">
          <span className="text-cyan-400">❯</span> cat profile.json
        </div>
        <div className="text-slate-500">{"{"}</div>
        {TERMINAL_LINES.map((l, i) => (
          <motion.div
            key={l.k}
            initial={{ opacity: 0, x: -8 }}
            animate={show ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.6 + i * 0.16, duration: 0.4, ease: EASE }}
            className="pl-4"
          >
            <span className="text-purple-300">{l.k}</span>
            <span className="text-slate-500">: </span>
            <span className="text-cyan-200">{l.v}</span>
            <span className="text-slate-500">,</span>
          </motion.div>
        ))}
        <div className="text-slate-500">{"}"}</div>
        <div className="text-slate-300 mt-1">
          <span className="text-cyan-400">❯</span>{" "}
          <span className="inline-block w-2 h-4 bg-cyan-300 align-middle t-cursor" />
        </div>
      </div>
    </div>
  );
}

export default function Hero({ entered, onNavigate, onAsk }) {
  const [imgOk, setImgOk] = useState(true);
  const sectionRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const tx = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const ty = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
      data-testid="hero-section"
    >
      <div className="max-w-6xl mx-auto px-5 w-full grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <MaskLine show={entered} delay={0.15}>
            <GreetingRotator show={entered} />
          </MaskLine>

          <div className="mt-6">
            <MaskLine show={entered} delay={0.3}>
              <h1
                data-testid="hero-name"
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04] text-white"
              >
                John Symaiah
              </h1>
            </MaskLine>
            <MaskLine show={entered} delay={0.42}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.04]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 text-glow">
                  M. Dagooc.
                </span>
              </h1>
            </MaskLine>
            <MaskLine show={entered} delay={0.54}>
              <p
                data-testid="hero-tagline"
                className="font-display text-2xl sm:text-3xl font-bold text-slate-500 mt-3"
              >
                I build things.
              </p>
            </MaskLine>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center gap-4 mt-7">
              {imgOk ? (
                <img
                  src={PROFILE_IMG}
                  alt="John Symaiah M. Dagooc"
                  data-testid="hero-profile-picture"
                  onError={() => setImgOk(false)}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.35)]"
                />
              ) : (
                <div
                  data-testid="hero-profile-picture"
                  className="w-16 h-16 rounded-full border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.35)]"
                >
                  <Rocket className="w-6 h-6 text-cyan-300" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-200">Full-Stack & AI Developer</span>
                <span className="font-mono2 text-xs text-slate-500">
                  BSIT Graduate · Bukidnon State University
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 mt-5 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3.5 py-1.5">
              <span className="status-dot" />
              <span className="font-mono2 text-[11px] tracking-widest uppercase text-emerald-300">
                Open to opportunities
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {CHIPS.map((c, i) => (
                <span
                  key={c}
                  data-testid={`hero-chip-${i}`}
                  className={`rounded-full border px-3 py-1 font-mono2 text-[11px] tracking-wide ${
                    i === 0
                      ? "border-yellow-400/50 text-yellow-300 bg-yellow-400/10"
                      : "border-cyan-400/25 text-slate-300 bg-white/[0.03]"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-6 max-w-xl">
              Fresh BSIT graduate from Bukidnon State University who ships production systems end to
              end — a construction &amp; trades marketplace, a university fleet-management platform,
              and a multi-role booking marketplace — across React, Node.js, Firebase, and Laravel,
              backed by two Cisco CCNA certifications.
            </p>
            <p className="font-mono2 text-[11px] tracking-[0.25em] text-slate-600 uppercase mt-3">
              Banking · Healthcare · Construction Mgmt · AI Systems
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                data-testid="resume-button"
                onClick={() => onNavigate("resume")}
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-7 py-3 font-mono2 text-sm font-bold tracking-wide text-[#030509] shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-shadow hover:shadow-[0_0_45px_rgba(0,240,255,0.55)]"
              >
                <FileDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                Resume
              </button>
              <button
                data-testid="ask-me-button"
                onClick={onAsk}
                className="inline-flex items-center gap-2.5 rounded-full border border-purple-400/50 bg-purple-400/10 px-7 py-3 font-mono2 text-sm font-bold tracking-wide text-purple-200 transition-colors hover:bg-purple-400/20"
              >
                <Terminal className="w-4 h-4" />
                Ask me anything
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={entered ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
          className="relative hidden lg:block"
          style={{ perspective: 1000 }}
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY, x: tx, y: ty }} className="relative">
            <div className="relative aspect-[5/6] max-h-[620px]">
              <CircuitBoard />
              <div className="planet-orb orb-1" />
              <div className="planet-orb orb-2" />
              <div className="planet-orb orb-3" />
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2">
                <TerminalCard show={entered} />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-2 top-10 glass border border-cyan-400/30 rounded-full px-4 py-2 font-mono2 text-[11px] text-cyan-200"
              >
                AI &amp; ML
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-2 top-1/3 glass border border-red-400/30 rounded-full px-4 py-2 font-mono2 text-[11px] text-red-300"
              >
                Laravel &amp; Firebase
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute left-6 bottom-8 glass border border-emerald-400/30 rounded-full px-4 py-2 font-mono2 text-[11px] text-emerald-300"
              >
                CCNA Certified
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        data-testid="scroll-hint-button"
        onClick={() => onNavigate("about")}
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 hover:text-cyan-300 transition-colors"
      >
        <span className="font-mono2 text-[10px] tracking-[0.35em] uppercase">scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          ▾
        </motion.span>
      </motion.button>
    </section>
  );
}
