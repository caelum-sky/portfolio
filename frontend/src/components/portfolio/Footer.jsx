import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { SOCIALS } from "../../data/portfolio";
import FooterGlobe from "./FooterGlobe";

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail };

export default function Footer({ onNavigate }) {
  return (
    <footer className="relative border-t border-cyan-500/15 py-10 sm:py-12" data-testid="footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 flex flex-col items-center gap-6 sm:gap-8">
        {/* Globe visitor map */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono2 text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-cyan-500/60">
            Visitors Around the Globe
          </p>
          <FooterGlobe />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-cyan-500/10" />

        {/* Bottom row: stacks on mobile, row on sm+ */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div>
            <div className="font-mono2 text-sm font-bold text-white">
              JSD<span className="text-cyan-400">://</span>
            </div>
            <p className="font-mono2 text-[10px] sm:text-[11px] text-slate-500 mt-0.5 sm:mt-1">
              Designed & built by John Symaiah M. Dagooc · Code. Ship. Rep.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {SOCIALS.filter((s) => ICONS[s.icon]).map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <a
                  key={s.label}
                  data-testid={`footer-social-${s.label.toLowerCase()}`}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-cyan-500/25 bg-white/[0.03] flex items-center justify-center text-slate-400 hover:text-cyan-300 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all active:scale-90"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
            <button
              data-testid="back-to-top-button"
              onClick={() => onNavigate("home")}
              aria-label="Back to top"
              className="w-9 h-9 rounded-full border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center text-cyan-300 hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all active:scale-90"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
