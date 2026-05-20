interface StatBlockProps {
  value: string;
  label: string;
  light?: boolean;
}

export default function StatBlock({ value, label, light = false }: StatBlockProps) {
  return (
    <div className="text-center">
      <div
        className={`text-4xl md:text-5xl font-bold mb-2 ${
          light ? "text-ud-white" : "text-ud-burgundy"
        }`}
      >
        {value}
      </div>
      <div
        className={`text-sm uppercase tracking-widest font-semibold ${
          light ? "text-white/70" : "text-ud-dark/60"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
