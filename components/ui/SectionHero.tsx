import DotMatrix from "./DotMatrix";

interface SectionHeroProps {
  title: string;
  subtitle?: string;
}

export default function SectionHero({ title, subtitle }: SectionHeroProps) {
  return (
    <section className="relative bg-ud-burgundy py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=60&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 p-8 opacity-30">
        <DotMatrix cols={14} rows={8} color="#ffffff" />
      </div>
      <div className="relative max-w-content mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ud-white mb-4 text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-white/80 font-light max-w-xl text-balance">{subtitle}</p>
        )}
        <div className="mt-6 w-16 h-1 bg-white/40" />
      </div>
    </section>
  );
}
