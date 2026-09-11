import { FileDown, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHead } from "./Section";
import { RESUME_URL } from "../../data/portfolio";

const HIGHLIGHTS = [
  "BSIT Graduate, Bukidnon State University — Class of 2026, Dean's Lister",
  "3 production systems shipped: BuildHub, BuKSU Motorpool, BookMe",
  "2x Cisco CCNA certified · TOPCIT Level 2 · Wadhwani Job Ready",
  "Stack: Laravel, React, Node.js/Express, Firebase, Capacitor, PyTorch",
];

export default function Resume() {
  return (
    <section id="resume" className="relative py-20 sm:py-28 overflow-hidden" data-testid="resume-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-5">
        <SectionHead
          index="07"
          eyebrow="Document"
          title="Resume"
          sub="The one-page summary — view it online or download the PDF."
        />
        <Reveal>
          <div className="glass border border-cyan-500/20 rounded-2xl overflow-hidden">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-white/5 bg-white/[0.03]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono2 text-[11px] text-slate-500 truncate">
                resume — John_Symaiah_Dagooc.pdf
              </span>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-start sm:items-center">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300 shrink-0" />
                  <div>
                    <p className="font-display font-bold text-white text-sm sm:text-base">John Symaiah M. Dagooc</p>
                    <p className="font-mono2 text-[10px] sm:text-[11px] text-slate-500">
                      Full-Stack & AI Developer · PDF
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-2.5">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-400">
                      <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons: row on mobile, column on sm+ */}
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
                <a
                  data-testid="resume-download-button"
                  href={RESUME_URL}
                  download="John_Symaiah_Dagooc_Resume.pdf"
                  onClick={() => toast.success("Resume download started")}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 font-mono2 text-[11px] sm:text-xs font-bold tracking-wide text-[#030509] shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-shadow active:scale-95"
                >
                  <FileDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Download
                </a>
                <a
                  data-testid="resume-view-button"
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-4 sm:px-6 py-2.5 sm:py-3 font-mono2 text-[11px] sm:text-xs font-bold tracking-wide text-cyan-200 hover:bg-cyan-400/15 transition-colors active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  View Online
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
