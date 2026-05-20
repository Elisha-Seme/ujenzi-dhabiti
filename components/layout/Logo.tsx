// Dot-matrix U symbol + wordmark. No JPEG background — transparent by design.
// variant="dark"  → white dots/text  (use on dark or burgundy backgrounds)
// variant="light" → burgundy dots/text (use on white or light backgrounds)

// (col, row) pairs that are filled — 5 cols × 7 rows
const FILLED = new Set([
  "0,0","0,1","0,3","0,4","0,5",          // left column (gap at row 2 = growth)
  "4,0","4,1","4,2","4,3","4,4","4,5",    // right column (full)
  "1,5","2,5","3,5",                       // base connector
  "1,6","2,6","3,6",                       // bottom inset row
]);

interface LogoProps {
  /** dark = white on transparent (navbar/footer); light = burgundy on transparent (light backgrounds) */
  variant?: "dark" | "light";
  /** controls rendered height; width scales proportionally */
  className?: string;
}

export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const COLS = 5;
  const ROWS = 7;
  const STEP = 9;   // px between dot centres
  const R = 3;      // dot radius

  const color      = variant === "dark" ? "#ffffff" : "#8a0e33";
  const subColor   = variant === "dark" ? "rgba(255,255,255,0.55)" : "rgba(138,14,51,0.55)";

  const symbolW = (COLS - 1) * STEP + R * 2;  // 38
  const symbolH = (ROWS - 1) * STEP + R * 2;  // 57

  const gap    = 11;
  const textX  = symbolW + gap;
  const nameY  = symbolH * 0.44;
  const tagY   = nameY + 15;
  const viewW  = textX + 150;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${symbolH}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ujenzi Dhabiti"
    >
      {/* Dot-matrix U */}
      {Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => {
          if (!FILLED.has(`${col},${row}`)) return null;
          return (
            <circle
              key={`${col}-${row}`}
              cx={col * STEP + R}
              cy={row * STEP + R}
              r={R}
              fill={color}
            />
          );
        })
      )}

      {/* Wordmark */}
      <text
        x={textX}
        y={nameY}
        fontFamily="Neris, Arial, sans-serif"
        fontWeight="700"
        fontSize="17"
        fill={color}
        letterSpacing="0.03em"
      >
        Ujenzi Dhabiti
      </text>
      <text
        x={textX + 1}
        y={tagY}
        fontFamily="Neris, Arial, sans-serif"
        fontWeight="600"
        fontSize="8"
        fill={subColor}
        letterSpacing="0.22em"
      >
        CONNECTING AFRICA
      </text>
    </svg>
  );
}
