import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const LINES = [
  {
    text: "SYSTEM INITIALIZATION // GRADUATION VERIFIED",
    cls: "font-mono2 text-[9px] xs:text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.35em] text-cyan-400 uppercase",
    delay: 0.1,
    glitch: true,
  },
  { text: "Greetings, visitor.", cls: "text-sm sm:text-base lg:text-lg text-slate-400", delay: 0.55 },
  { text: "You've entered the universe of", cls: "text-sm sm:text-base lg:text-lg text-slate-400", delay: 1.0 },
  {
    text: "JOHN SYMAIAH M. DAGOOC",
    cls: "font-display text-[1.6rem] xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white text-glow leading-tight",
    delay: 1.45,
  },
  {
    text: "Code. Ship. Rep.",
    cls: "font-mono2 text-xs sm:text-sm lg:text-base text-yellow-300 text-glow-gold tracking-widest",
    delay: 1.95,
  },
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
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-cyan-500/15 blur-[100px] sm:blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-purple-600/15 blur-[100px] sm:blur-[130px]" />
      </div>

      {/* Skip button */}
      <button
        data-testid="skip-intro-button"
        onClick={onEnter}
        className="absolute top-5 sm:top-6 right-4 sm:right-6 font-mono2 text-[10px] sm:text-xs tracking-widest text-slate-500 hover:text-cyan-300 transition-colors uppercase px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-400/30 bg-white/[0.03] hover:bg-cyan-400/5"
      >
        Skip ⟶
      </button>

      {/* Content */}
      <div className="relative text-center px-5 sm:px-6 w-full max-w-[90vw] sm:max-w-none space-y-3 sm:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 border border-cyan-400/30 rounded-full px-3 sm:px-4 py-1.5 font-mono2 text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] text-cyan-300 uppercase mb-2 sm:mb-4"
        >
          ✦ Welcome ✦
        </motion.div>

        {LINES.map((l) => (
          <div key={l.text} className="overflow-hidden">
            <motion.p
              data-text={l.glitch ? l.text : undefined}
              className={`${l.cls} ${l.glitch ? "glitch" : ""} block`}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: l.delay, duration: 0.65, ease: EASE }}
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
          transition={{ duration: 0.5, ease: EASE }}
          className="group mt-4 sm:mt-6 inline-flex items-center gap-2 sm:gap-3 rounded-full border border-cyan-400/50 bg-cyan-400/10 px-6 sm:px-8 py-2.5 sm:py-3 font-mono2 text-xs sm:text-sm tracking-widest text-cyan-200 uppercase transition-all hover:bg-cyan-400/20 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] active:scale-95"
        >
          Enter Portfolio
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      {/* Progress bar */}
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
