import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import "@/App.css";
import GalaxyCursor from "@/components/portfolio/GalaxyCursor";
import Starfield from "@/components/portfolio/Starfield";
import WelcomeGate from "@/components/portfolio/WelcomeGate";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import Marquee from "@/components/portfolio/Marquee";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import { Achievements, Certifications } from "@/components/portfolio/Credentials";
import Resume from "@/components/portfolio/Resume";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import AskMeModal from "@/components/portfolio/AskMeModal";

function App() {
  const [entered, setEntered] = useState(false);
  const [amaOpen, setAmaOpen] = useState(false);
  const lenisRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  // Fire-and-forget visitor ping for the globe
  useEffect(() => {
    const api = (import.meta.env.VITE_BACKEND_URL || "") + "/api";
    fetch(`${api}/visits/ping`, { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!entered) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [entered]);

  const handleEnter = useCallback(() => setEntered(true), []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -70, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030509] text-slate-100 overflow-x-hidden">
      <GalaxyCursor />
      <Starfield />
      <div className="grain" />

      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
        style={{ scaleX: progress }}
        data-testid="scroll-progress-bar"
      />

      <AnimatePresence>
        {!entered && <WelcomeGate key="gate" onEnter={handleEnter} />}
      </AnimatePresence>

      <Navbar entered={entered} onNavigate={scrollTo} onAsk={() => setAmaOpen(true)} />

      <main className="relative z-10">
        <Hero entered={entered} onNavigate={scrollTo} onAsk={() => setAmaOpen(true)} />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Certifications />
        <Resume />
        <Contact />
      </main>

      <Footer onNavigate={scrollTo} />
      <AskMeModal open={amaOpen} onClose={() => setAmaOpen(false)} />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
