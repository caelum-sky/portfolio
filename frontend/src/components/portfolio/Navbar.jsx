import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ entered, onNavigate, onAsk }) {
  const [open, setOpen] = useState(false);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={entered ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-cyan-500/20"
      data-testid="navbar"
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => go("home")}
          className="font-mono2 text-sm font-bold text-white tracking-tight hover:text-cyan-300 transition-colors"
        >
          JSD<span className="text-cyan-400">://</span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="font-mono2 text-xs tracking-widest uppercase text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-ask-button"
            onClick={onAsk}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 font-mono2 text-xs tracking-widest uppercase text-cyan-200 hover:bg-cyan-400/20 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            Ask AI
          </button>
        </nav>

        <button
          data-testid="nav-menu-toggle"
          className="md:hidden text-slate-300"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-cyan-500/10 px-5 py-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-mobile-link-${l.id}`}
              onClick={() => go(l.id)}
              className="text-left font-mono2 text-sm tracking-widest uppercase text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-mobile-ask-button"
            onClick={() => {
              setOpen(false);
              onAsk();
            }}
            className="text-left font-mono2 text-sm tracking-widest uppercase text-cyan-300"
          >
            Ask AI
          </button>
        </div>
      )}
    </motion.header>
  );
}
