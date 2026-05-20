"use client";

import { useEffect, useRef } from "react";

interface DotMatrixProps {
  className?: string;
  cols?: number;
  rows?: number;
  color?: string;
  animate?: boolean;
  opacity?: number;
}

export default function DotMatrix({
  className = "",
  cols = 12,
  rows = 10,
  color = "#8a0e33",
  animate = false,
  opacity = 0.15,
}: DotMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !containerRef.current) return;
    const dots = containerRef.current.querySelectorAll(".dot-item");
    dots.forEach((dot, i) => {
      const el = dot as HTMLElement;
      el.style.opacity = "0";
      el.style.transform = "scale(0)";
      setTimeout(() => {
        el.style.transition = `opacity 0.3s ease, transform 0.3s ease`;
        el.style.opacity = String(opacity);
        el.style.transform = "scale(1)";
      }, i * 15 + 100);
    });
  }, [animate, opacity]);

  const removedPositions = new Set([
    "0-0", "0-1", "0-2",
    "1-0", "1-1",
    "2-0",
  ]);

  return (
    <div
      ref={containerRef}
      className={`grid gap-2 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 6px)`,
        gridTemplateRows: `repeat(${rows}, 6px)`,
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const key = `${row}-${col}`;
          const isRemoved = removedPositions.has(key);
          const distFromTopRight = (col / cols) + (1 - row / rows);
          const dotOpacity = animate
            ? 0
            : isRemoved
            ? 0
            : opacity * Math.min(1, distFromTopRight * 0.8 + 0.3);

          return (
            <div
              key={key}
              className="dot-item rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: isRemoved ? "transparent" : color,
                opacity: dotOpacity,
              }}
            />
          );
        })
      )}
    </div>
  );
}
