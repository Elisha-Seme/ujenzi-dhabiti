import Link from "next/link";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark = false }: LogoProps) {
  const dotColor = dark ? "#8a0e33" : "#ffffff";
  const textColor = dark ? "#1c1e22" : "#ffffff";
  const taglineColor = dark ? "#8a0e33" : "rgba(255,255,255,0.7)";

  const cols = 5;
  const rows = 7;
  const removedDots = new Set(["0-0", "0-1", "0-2", "1-0", "1-1", "2-0", "3-0", "3-1", "4-0", "4-1", "4-2", "5-0", "5-1", "6-0"]);

  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Ujenzi Dhabiti Home">
      <svg width="36" height="52" viewBox="0 0 36 52" fill="none" aria-hidden="true">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const key = `${row}-${col}`;
            if (removedDots.has(key)) return null;
            return (
              <circle
                key={key}
                cx={col * 8 + 4}
                cy={row * 8 + 4}
                r="2.5"
                fill={dotColor}
                opacity="0.9"
              />
            );
          })
        )}
      </svg>
      <div>
        <div className="text-base font-bold leading-tight" style={{ color: textColor, fontFamily: "Neris, Arial, sans-serif" }}>
          Ujenzi Dhabiti
        </div>
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase leading-none mt-0.5" style={{ color: taglineColor }}>
          CONNECTING AFRICA
        </div>
      </div>
    </Link>
  );
}
