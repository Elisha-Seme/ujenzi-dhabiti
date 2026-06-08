// Deep-burgundy blueprint backdrop (the brand "Core Identity" look).
//   variant="hero"   → vivid: full blueprint, burgundy multiply, bright glow.
//   variant="subtle" → calm: mostly solid dark with a faint blueprint texture and
//                      no glow, so content (cards) is the focus. Top/bottom blend
//                      into solid #1c1e22 so it joins neighbouring dark sections
//                      seamlessly.
// Drop inside a `relative` container.
export default function BlueprintBg({
  variant = "hero",
  className = "",
}: {
  variant?: "hero" | "subtle";
  className?: string;
}) {
  if (variant === "subtle") {
    return (
      <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-ud-dark" />
        {/* Faint blueprint texture — quiet, no glow */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.10]"
          style={{ backgroundImage: "url('/bg-image.webp')" }}
        />
        <div className="absolute inset-0 bg-ud-burgundy/12 mix-blend-multiply" />
        {/* Blend top + bottom into solid dark for seamless joins with neighbours */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ud-dark to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ud-dark to-transparent" />
      </div>
    );
  }

  // hero (vivid)
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base + blueprint image */}
      <div className="absolute inset-0 bg-ud-dark" />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-image.webp')" }}
      />
      {/* Burgundy multiply turns the white blueprint lines deep red */}
      <div className="absolute inset-0 bg-ud-burgundy mix-blend-multiply opacity-90" />
      {/* Brighter red core + warm ambient glow toward centre-right */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 60% 50%, rgba(176,32,74,0.40), transparent 42%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 75% 65% at 62% 52%, rgba(138,14,51,0.60), transparent 68%)" }}
      />
      {/* Depth vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-ud-dark/50 via-transparent to-ud-dark/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-ud-dark/75 via-ud-dark/5 to-transparent" />
    </div>
  );
}
