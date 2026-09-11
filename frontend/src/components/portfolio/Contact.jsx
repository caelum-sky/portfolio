import { useState } from "react";
import { toast } from "sonner";
import { Github, Linkedin, Mail, Facebook, Send, Copy, Loader2 } from "lucide-react";
import { Reveal, SectionHead } from "./Section";
import { SOCIALS } from "../../data/portfolio";

const API = (import.meta.env.VITE_BACKEND_URL || "") + "/api";
const SOC_ICONS = { github: Github, linkedin: Linkedin, mail: Mail, facebook: Facebook };

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("non-2xx");
      toast.success("Transmission received — I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Transmission failed — try emailing me directly instead.");
    } finally {
      setSending(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("johndagooc2@gmail.com");
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Couldn't copy — it's johndagooc2@gmail.com");
    }
  };

  return (
    <section id="contact" className="relative py-28" data-testid="contact-section">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead
          index="08"
          eyebrow="Let's Talk"
          title="Get In Touch"
          sub="Have a project in mind? I just graduated and I'm ready — let's build something."
        />
        <div className="grid lg:grid-cols-2 gap-14">
          <Reveal>
            <div className="space-y-3">
              {SOCIALS.map((s) => {
                const Icon = SOC_ICONS[s.icon];
                return (
                  <a
                    key={s.label}
                    data-testid={`social-link-${s.label.toLowerCase()}`}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 glass border border-cyan-500/15 rounded-xl px-5 py-4 hover:border-cyan-400/45 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-200 transition-colors">
                        {s.label}
                      </div>
                      <div className="font-mono2 text-[11px] text-slate-500">{s.sub}</div>
                    </div>
                  </a>
                );
              })}
              <button
                data-testid="copy-email-button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 mt-2 rounded-full border border-purple-400/40 bg-purple-400/10 px-5 py-2.5 font-mono2 text-xs text-purple-200 hover:bg-purple-400/20 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy email address
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={submit}
              className="glass border border-cyan-500/20 rounded-2xl p-6 sm:p-8 space-y-5"
              data-testid="contact-form"
            >
              <div className="font-mono2 text-[11px] tracking-[0.25em] uppercase text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Encrypted transmission channel
              </div>
              <div>
                <label htmlFor="contact-name" className="font-mono2 text-xs text-slate-400 block mb-1.5">
                  Name
                </label>
                <input
                  id="contact-name"
                  data-testid="contact-name-input"
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400/60 focus:shadow-[0_0_18px_rgba(0,240,255,0.15)] transition-all"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="font-mono2 text-xs text-slate-400 block mb-1.5">
                  Email
                </label>
                <input
                  id="contact-email"
                  data-testid="contact-email-input"
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400/60 focus:shadow-[0_0_18px_rgba(0,240,255,0.15)] transition-all"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="font-mono2 text-xs text-slate-400 block mb-1.5">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  data-testid="contact-message-input"
                  required
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell me about your project..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-400/60 focus:shadow-[0_0_18px_rgba(0,240,255,0.15)] transition-all resize-none"
                />
              </div>
              <button
                data-testid="contact-send-button"
                type="submit"
                disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-7 py-3.5 font-mono2 text-sm font-bold tracking-wide text-[#030509] shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_45px_rgba(0,240,255,0.5)] transition-shadow disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Transmitting..." : "Send Message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
