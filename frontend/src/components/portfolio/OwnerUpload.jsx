import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { X, Upload, Image as ImageIcon, FileText, KeyRound } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OwnerUpload({ open, onClose }) {
  const [pin, setPin] = useState("");
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [busy, setBusy] = useState("");

  const upload = async (kind, file) => {
    if (!pin) {
      toast.error("Enter your owner passcode first");
      return;
    }
    if (!file) {
      toast.error(`Choose a ${kind === "photo" ? "photo" : "PDF"} file first`);
      return;
    }
    setBusy(kind);
    try {
      const fd = new FormData();
      fd.append("kind", kind);
      fd.append("pin", pin);
      fd.append("file", file);
      await axios.post(`${API}/assets/upload`, fd);
      toast.success(
        kind === "photo"
          ? "Profile photo updated — it will appear within a minute"
          : "Resume updated — the Resume section is now live"
      );
    } catch (e) {
      toast.error(e.response?.data?.detail || "Upload failed");
    } finally {
      setBusy("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="owner-upload-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#030509]/85 backdrop-blur-md px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass border border-cyan-500/25 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,114,255,0.2)]"
            role="dialog"
            aria-modal="true"
            aria-label="Owner upload"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.03]">
              <span className="font-mono2 text-xs tracking-widest uppercase text-cyan-300">
                Owner Studio — Asset Upload
              </span>
              <button
                data-testid="owner-close-button"
                onClick={onClose}
                aria-label="Close"
                className="text-slate-500 hover:text-cyan-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="owner-pin" className="font-mono2 text-xs text-slate-400 block mb-1.5">
                  Owner passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="owner-pin"
                    data-testid="owner-pin-input"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-400/60 transition-colors"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ImageIcon className="w-4 h-4 text-cyan-300" />
                  Profile photo <span className="font-mono2 text-[10px] text-slate-600">JPG / PNG / WebP</span>
                </div>
                <input
                  data-testid="owner-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-400/10 file:px-4 file:py-2 file:font-mono2 file:text-xs file:text-cyan-200 hover:file:bg-cyan-400/20"
                />
                <button
                  data-testid="owner-upload-photo-button"
                  onClick={() => upload("photo", photo)}
                  disabled={busy !== ""}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-2 font-mono2 text-xs font-bold text-[#030509] disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {busy === "photo" ? "Uploading…" : "Upload Photo"}
                </button>
              </div>

              <div className="rounded-xl border border-white/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <FileText className="w-4 h-4 text-yellow-300" />
                  Resume <span className="font-mono2 text-[10px] text-slate-600">PDF only</span>
                </div>
                <input
                  data-testid="owner-resume-input"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-yellow-400/10 file:px-4 file:py-2 file:font-mono2 file:text-xs file:text-yellow-200 hover:file:bg-yellow-400/20"
                />
                <button
                  data-testid="owner-upload-resume-button"
                  onClick={() => upload("resume", resume)}
                  disabled={busy !== ""}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2 font-mono2 text-xs font-bold text-[#030509] disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {busy === "resume" ? "Uploading…" : "Upload Resume"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
