import DotMatrix from "./DotMatrix";
import BlueprintBg from "./BlueprintBg";

interface SectionHeroProps {
  title: string;
  subtitle?: string;
}

export default function SectionHero({ title, subtitle }: SectionHeroProps) {
  return (
    <section className="relative py-28 md:py-32 overflow-hidden">
      <BlueprintBg />
      <div className="absolute bottom-0 right-0 p-8 opacity-40">
        <DotMatrix cols={14} rows={8} color="#ffffff" />
      </div>
      <div className="relative max-w-content mx-auto px-6 pt-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-ud-white mb-4 text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-white/75 font-light max-w-xl text-balance">{subtitle}</p>
        )}
        <div className="mt-6 w-16 h-1 bg-ud-burgundy" />
      </div>
    </section>
  );
}
