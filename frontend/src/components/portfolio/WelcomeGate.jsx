import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const LINES = [
  { text: "SYSTEM INITIALIZATION // GRADUATION VERIFIED", cls: "font-mono2 text-[11px] sm:text-xs tracking-[0.35em] text-cyan-400 uppercase", delay: 0.1, glitch: true },
  { text: "Greetings, visitor.", cls: "text-base sm:text-lg text-slate-400", delay: 0.55 },
  { text: "You've entered the universe of", cls: "text-base sm:text-lg text-slate-400", delay: 1.0 },
  { text: "JOHN SYMAIAH M. DAGOOC", cls: "font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-glow", delay: 1.45 },
  { text: "Code. Ship. Rep.", cls: "font-mono2 text-sm sm:text-base text-yellow-300 text-glow-gold tracking-widest", delay: 1.95 },
];

export default function WelcomeGate({ onEnter }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const readyT = setTimeout(() => setReady(true), 2400);
    const autoT = setTimeout(onEnter, 3200);
    return () => {
      clearTimeout(readyT);
      clearTimeout(autoT);
    };
  }, [onEnter]);

  return (
    <motion.div
      data-testid="welcome-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030509] overflow-hidden"
      exit={{ opacity: 0, scale: 1.12, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[130px]" />
      </div>

      <button
        data-testid="skip-intro-button"
        onClick={onEnter}
        className="absolute top-6 right-6 font-mono2 text-xs tracking-widest text-slate-500 hover:text-cyan-300 transition-colors uppercase"
      >
        Skip intro ⟶
      </button>

      <div className="relative text-center px-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-cyan-400/30 rounded-full px-4 py-1.5 font-mono2 text-[11px] tracking-[0.3em] text-cyan-300 uppercase mb-4"
        >
          ✦ Welcome ✦
        </motion.div>

        {LINES.map((l) => (
          <div key={l.text} className="overflow-hidden">
            <motion.p
              data-text={l.glitch ? l.text : undefined}
              className={`${l.cls} ${l.glitch ? "glitch" : ""}`}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: l.delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {l.text}
            </motion.p>
          </div>
        ))}

        <motion.button
          data-testid="enter-portfolio-button"
          onClick={onEnter}
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="group mt-6 inline-flex items-center gap-3 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-8 py-3 font-mono2 text-sm tracking-widest text-cyan-200 uppercase transition-colors hover:bg-cyan-400/20 hover:border-cyan-300"
        >
          Enter Portfolio
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
        <motion.div
          data-testid="welcome-progress-fill"
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
