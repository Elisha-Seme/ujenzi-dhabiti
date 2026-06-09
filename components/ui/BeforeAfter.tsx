"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Draggable before/after image comparison. Drag the handle (or use arrow keys)
// to reveal the "before" photo over the "after".
export default function BeforeAfter({ before, after, alt = "" }: { before: string; after: string; alt?: string }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={alt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={alt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className="absolute top-2.5 left-2.5 z-20 pointer-events-none bg-ud-dark/70 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-[4px]">Before</span>
      <span className="absolute top-2.5 right-2.5 z-20 pointer-events-none bg-ud-burgundy text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-[4px]">After</span>

      {/* Handle line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-10" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-ud-dark">
          <ChevronLeft className="w-3 h-3 -mr-1" />
          <ChevronRight className="w-3 h-3 -ml-1" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Before / after comparison slider"
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
      />
    </div>
  );
}
