"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Logo from "@/components/layout/Logo";

// Premium intro loader with distinct enter / hold / exit phases.
// The overlay is rendered in the INITIAL HTML (opaque dark, video hidden) so it
// covers the page from the very first paint — the loader is strictly first, with
// no flash of the site behind it. On a repeat visit in the same session it is
// removed immediately after hydration.
const SESSION_KEY = "ud:loader:shown";

// Easing curves
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)"; // gentle deceleration (enter)
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)"; // smooth accelerate→settle (exit)

export default function LoadingScreen() {
  // phase starts at "enter" → overlay paints opaque, visuals hidden, no flash.
  const [phase, setPhase] = useState<"enter" | "in" | "exit">("enter");
  const [gone, setGone] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Already shown this session → remove instantly (no second play).
    if (sessionStorage.getItem(SESSION_KEY)) {
      setGone(true);
      return;
    }
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setReduce(rm);

    const hold = rm ? 1400 : 4400;
    const raf = requestAnimationFrame(() => setPhase("in")); // trigger enter transition
    const toExit = setTimeout(() => setPhase("exit"), hold);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(toExit);
    };
  }, []);

  // The "shown" flag is written only when exiting so Strict-Mode's double-effect
  // still re-arms the timers above on a first visit.
  useEffect(() => {
    if (phase !== "exit") return;
    sessionStorage.setItem(SESSION_KEY, "1");
    const exitMs = reduce ? 450 : 950;
    const t = setTimeout(() => setGone(true), exitMs);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  if (gone) return null;

  const entering = phase === "enter";
  const exiting = phase === "exit";
  const exitMs = reduce ? 450 : 950;

  // Overlay stays opaque until exit, then fades to reveal the app behind it.
  // Inline backgroundColor guarantees it's dark even before CSS classes apply.
  const overlayStyle: CSSProperties = {
    backgroundColor: "#1c1e22",
    opacity: exiting ? 0 : 1,
    transition: `opacity ${exitMs}ms ${EASE_IN_OUT}`,
    pointerEvents: exiting ? "none" : "auto",
    willChange: "opacity",
  };

  // The cinematic stage (video + washes) fades + scales in, then scales + blurs out.
  const stageStyle: CSSProperties = reduce
    ? { opacity: phase === "in" ? 1 : 0, transition: `opacity ${entering ? 300 : exitMs}ms ease` }
    : {
        opacity: phase === "in" ? 1 : 0,
        transform: exiting ? "scale(1.06)" : entering ? "scale(1.05)" : "scale(1)",
        filter: exiting ? "blur(12px)" : "blur(0px)",
        transition: exiting
          ? `opacity ${exitMs}ms ${EASE_IN_OUT}, transform ${exitMs}ms ${EASE_IN_OUT}, filter ${exitMs}ms ${EASE_IN_OUT}`
          : `opacity 850ms ${EASE_OUT}, transform 1100ms ${EASE_OUT}, filter 800ms ease`,
        willChange: "opacity, transform, filter",
      };

  // The logo + tagline lift in, then drift up and fade as we hand off.
  const contentStyle: CSSProperties = reduce
    ? { opacity: phase === "in" ? 1 : 0, transition: `opacity ${entering ? 300 : exitMs}ms ease` }
    : {
        opacity: phase === "in" ? 1 : 0,
        transform: exiting ? "translateY(-10px) scale(0.985)" : entering ? "translateY(14px)" : "translateY(0)",
        transition: exiting
          ? `opacity ${Math.round(exitMs * 0.7)}ms ${EASE_IN_OUT}, transform ${exitMs}ms ${EASE_IN_OUT}`
          : `opacity 850ms 120ms ${EASE_OUT}, transform 1000ms ${EASE_OUT}`,
        willChange: "opacity, transform",
      };

  return (
    <div aria-hidden className="fixed inset-0 z-[100] flex items-center justify-center" style={overlayStyle}>
      {/* Stage — fades + scales + blurs as one unit */}
      <div className="absolute inset-0 overflow-hidden" style={stageStyle}>
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/loader-poster.webp">
          <source src="/loader.webm" type="video/webm" />
          <source src="/loader.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-ud-burgundy/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ud-dark/85 via-ud-dark/30 to-ud-dark/55" />
      </div>

      {/* Content — logo, tagline, and a clean determinate progress bar */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" style={contentStyle}>
        <Logo variant="dark" layout="stacked" className="h-20 md:h-24 w-auto" />
        <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
          Connecting Africa
        </div>
        <div className="mt-6 h-px w-44 overflow-hidden bg-white/15">
          <div
            className="h-full bg-ud-burgundy"
            style={{
              width: phase === "enter" ? "0%" : "100%",
              transition: `width ${reduce ? 1200 : 4200}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
