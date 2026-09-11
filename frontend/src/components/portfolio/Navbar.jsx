import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

const EASE = [0.22, 1, 0.36, 1];

export default function Navbar({ entered, onNavigate, onAsk }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // track scroll position for enhanced glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // track active section via IntersectionObserver
  useEffect(() => {
    const sections = ["home", "about", "skills", "experience", "projects", "certifications", "contact"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [entered]);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={entered ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 transition-all duration-300 ${
        scrolled ? "glass shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : "bg-transparent backdrop-blur-[12px]"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          data-testid="nav-logo"
          onClick={() => go("home")}
          className="font-mono2 text-sm font-bold text-white tracking-tight hover:text-cyan-300 transition-colors relative group"
        >
          JSD<span className="text-cyan-400">://</span>
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="relative font-mono2 text-xs tracking-widest uppercase transition-colors group"
            >
              <span className={`transition-colors ${activeId === l.id ? "text-cyan-300" : "text-slate-400 group-hover:text-cyan-300"}`}>
                {l.label}
              </span>
              {/* animated underline */}
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={false}
                animate={{ width: activeId === l.id ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </button>
          ))}
          <button
            data-testid="nav-ask-button"
            onClick={onAsk}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 font-mono2 text-xs tracking-widest uppercase text-cyan-200 hover:bg-cyan-400/20 transition-all hover:border-cyan-400/70 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <Terminal className="w-3.5 h-3.5" />
            Ask AI
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          data-testid="nav-menu-toggle"
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all active:scale-95"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="md:hidden overflow-hidden glass border-t border-cyan-500/10"
          >
            <motion.div
              className="px-4 py-3 flex flex-col gap-1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                hidden: {},
              }}
            >
              {LINKS.map((l) => (
                <motion.button
                  key={l.id}
                  data-testid={`nav-mobile-link-${l.id}`}
                  variants={{
                    hidden: { x: -16, opacity: 0 },
                    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: EASE } },
                  }}
                  onClick={() => go(l.id)}
                  className={`text-left w-full flex items-center justify-between rounded-lg px-3 py-2.5 font-mono2 text-sm tracking-widest uppercase transition-all ${
                    activeId === l.id
                      ? "text-cyan-300 bg-cyan-400/10 border border-cyan-400/20"
                      : "text-slate-300 hover:text-cyan-300 hover:bg-white/[0.04]"
                  }`}
                >
                  {l.label}
                  {activeId === l.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  )}
                </motion.button>
              ))}
              <motion.button
                data-testid="nav-mobile-ask-button"
                variants={{
                  hidden: { x: -16, opacity: 0 },
                  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: EASE } },
                }}
                onClick={() => { setOpen(false); onAsk(); }}
                className="flex items-center gap-2 mt-1 rounded-lg px-3 py-2.5 font-mono2 text-sm tracking-widest uppercase text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/15 transition-all"
              >
                <Terminal className="w-4 h-4" />
                Ask AI
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
