import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { AMA, AMA_FALLBACK } from "../../data/portfolio";

const findAnswer = (text) => {
  const t = text.toLowerCase();
  const hit = AMA.find((item) => item.keywords.some((k) => t.includes(k)));
  return hit ? hit.a : AMA_FALLBACK;
};

export default function AskMeModal({ open, onClose }) {
  const [log, setLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const logRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLog([
        {
          q: "whoami",
          a: "John Symaiah M. Dagooc — BSIT graduate of Bukidnon State University, full-stack & AI developer based in the Philippines.",
        },
      ]);
      setInput("");
    }
    return () => clearInterval(timerRef.current);
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const ask = (question, answer) => {
    if (typing) return;
    setTyping(true);
    setLog((l) => [...l, { q: question, a: "" }]);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 3;
      const slice = answer.slice(0, i);
      setLog((l) => {
        const copy = [...l];
        copy[copy.length - 1] = { q: question, a: slice };
        return copy;
      });
      if (i >= answer.length) {
        clearInterval(timerRef.current);
        setTyping(false);
      }
    }, 14);
  };

  const submitCustom = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || typing) return;
    setInput("");
    ask(q, findAnswer(q));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="ama-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#030509]/85 backdrop-blur-md px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl glass border border-cyan-500/25 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,114,255,0.2)]"
            role="dialog"
            aria-modal="true"
            aria-label="Ask me anything"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono2 text-[11px] text-slate-400">ask-me-anything.sh</span>
              </div>
              <button
                data-testid="ama-close-button"
                onClick={onClose}
                aria-label="Close"
                className="text-slate-500 hover:text-cyan-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={logRef} className="h-72 overflow-y-auto p-5 space-y-4 font-mono2 text-[13px]">
              {log.map((entry, i) => (
                <div key={`${entry.q}-${i}`}>
                  <div className="text-slate-300">
                    <span className="text-cyan-400">❯</span> {entry.q}
                  </div>
                  <div className="text-slate-400 leading-relaxed mt-1 pl-4 border-l border-cyan-500/20">
                    {entry.a}
                    {typing && i === log.length - 1 && (
                      <span className="inline-block w-1.5 h-3.5 bg-cyan-300 align-middle ml-0.5 t-cursor" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {AMA.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  data-testid={`ama-question-${item.id}`}
                  disabled={typing}
                  onClick={() => ask(item.q, item.a)}
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3.5 py-1.5 font-mono2 text-[11px] text-cyan-200 hover:bg-cyan-400/15 transition-colors disabled:opacity-40"
                >
                  {item.q}
                </button>
              ))}
            </div>

            <form onSubmit={submitCustom} className="flex items-center gap-2 border-t border-white/5 px-4 py-3">
              <span className="font-mono2 text-cyan-400 text-sm">❯</span>
              <input
                data-testid="ama-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="type a question…"
                className="flex-1 bg-transparent font-mono2 text-sm text-slate-200 placeholder:text-slate-600 outline-none"
              />
              <button
                data-testid="ama-send-button"
                type="submit"
                disabled={typing}
                aria-label="Send question"
                className="text-cyan-300 hover:text-cyan-100 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
