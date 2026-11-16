"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A scroll area that shows it can scroll: soft fades at the top/bottom edges
 * while there's more content that way, plus an optional "Scroll for more" cue.
 * Height is capped by `className` (e.g. a max-h tied to the viewport).
 * `watch` re-measures when the content swaps (e.g. a different service).
 */
export default function ScrollFade({
  children,
  className = "",
  fadeColor,
  hint = false,
  watch,
}: {
  children: ReactNode;
  className?: string;
  fadeColor: string;
  hint?: boolean;
  watch?: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({
      top: el.scrollTop > 4,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => { el.removeEventListener("scroll", update); observer.disconnect(); };
  }, [watch]);

  return (
    <div className="relative">
      <div ref={ref} className={`overflow-y-auto overscroll-contain [scrollbar-width:thin] ${className}`}>
        {children}
      </div>
      <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-6 transition-opacity duration-150 ${edges.top ? "opacity-100" : "opacity-0"}`} style={{ background: `linear-gradient(to bottom, ${fadeColor}, transparent)` }} />
      <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 h-12 transition-opacity duration-150 ${edges.bottom ? "opacity-100" : "opacity-0"}`} style={{ background: `linear-gradient(to top, ${fadeColor}, transparent)` }} />
      {hint && edges.bottom && (
        <span aria-hidden className="pointer-events-none absolute bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/70">
          Scroll for more <ChevronDown size={11} />
        </span>
      )}
    </div>
  );
}
