import Image from "next/image";

// Authentic brand mark, background-keyed to transparent PNG so it sits cleanly on
// any surface. Pick the variant that CONTRASTS the background it's placed on:
//   variant="dark"  → white mark   → use on dark / burgundy backgrounds
//   variant="light" → burgundy mark → use on white / light-gray backgrounds
// layout="horizontal" (symbol + wordmark inline) or "stacked" (symbol over wordmark).

interface LogoProps {
  variant?: "dark" | "light";
  layout?: "horizontal" | "stacked";
  /** controls rendered height; width scales proportionally (set w-auto in className) */
  className?: string;
  priority?: boolean;
}

const SRC = {
  horizontal: {
    dark: "/logo-horizontal-dark.png",
    light: "/logo-horizontal-light.png",
    w: 1576,
    h: 312,
  },
  stacked: {
    dark: "/logo-stacked-dark.png",
    light: "/logo-stacked-light.png",
    w: 1296,
    h: 808,
  },
} as const;

export default function Logo({
  variant = "dark",
  layout = "horizontal",
  className = "",
  priority = false,
}: LogoProps) {
  const cfg = SRC[layout];
  return (
    <Image
      src={cfg[variant]}
      alt="Ujenzi Dhabiti — Connecting Africa"
      width={cfg.w}
      height={cfg.h}
      priority={priority}
      className={className}
    />
  );
}
