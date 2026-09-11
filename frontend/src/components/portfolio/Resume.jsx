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
    <section id="resume" className="relative py-28" data-testid="resume-section">
      <div className="max-w-4xl mx-auto px-5">
        <SectionHead
          index="07"
          eyebrow="Document"
          title="Resume"
          sub="The one-page summary — view it online or download the PDF."
        />
        <Reveal>
          <div className="glass border border-cyan-500/20 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.03]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono2 text-[11px] text-slate-500">
                resume — John_Symaiah_Dagooc.pdf
              </span>
            </div>
            <div className="p-6 sm:p-8 grid sm:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <FileText className="w-6 h-6 text-cyan-300" />
                  <div>
                    <p className="font-display font-bold text-white">John Symaiah M. Dagooc</p>
                    <p className="font-mono2 text-[11px] text-slate-500">
                      Full-Stack & AI Developer · PDF
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="text-cyan-400 mt-0.5">▸</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex sm:flex-col gap-3">
                <a
                  data-testid="resume-download-button"
                  href={RESUME_URL}
                  download="John_Symaiah_Dagooc_Resume.pdf"
                  onClick={() => toast.success("Resume download started")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-3 font-mono2 text-xs font-bold tracking-wide text-[#030509] shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-shadow"
                >
                  <FileDown className="w-4 h-4" />
                  Download PDF
                </a>
                <a
                  data-testid="resume-view-button"
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-6 py-3 font-mono2 text-xs font-bold tracking-wide text-cyan-200 hover:bg-cyan-400/15 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
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
