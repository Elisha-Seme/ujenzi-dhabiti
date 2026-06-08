import Link from "next/link";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";

// A teaser for the per-property-type house-plans shop the brief asks for.
// The plan catalogue (digital + print) is pending the catalogue rebuild, so for
// now this routes buyers to the shop and signals the format options.
export function PlanShopTeaser({ type }: { type: string }) {
  return (
    <div className="mt-6 bg-ud-light-gray border border-ud-burgundy/15 rounded-[4px] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-ud-dark">{type} House Plans</p>
        <p className="text-xs text-ud-dark/55 leading-relaxed">
          Browse ready-to-build {type.toLowerCase()} plans — available as a digital download or a printed copy.
        </p>
      </div>
      <Link
        href={`/shop/plans?type=${encodeURIComponent(type)}`}
        className="inline-flex items-center justify-center gap-1.5 bg-ud-burgundy text-white text-xs font-bold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors whitespace-nowrap"
      >
        Shop Plans <ArrowRight size={13} />
      </Link>
    </div>
  );
}

// Intro block at the top of a service section: eyebrow + heading + lead paragraphs.
export function ServiceIntro({
  eyebrow,
  title,
  paragraphs,
  tagline,
}: {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  tagline?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">{eyebrow}</div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-ud-dark mb-5">{title}</h2>
      <div className="space-y-4 text-ud-dark/70 font-light leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {tagline && <p className="mt-5 text-ud-burgundy font-semibold italic">{tagline}</p>}
    </div>
  );
}

// A single sub-service / type with optional bullet list and optional plan-shop teaser.
export function ServiceType({
  title,
  body,
  bullets,
  planType,
}: {
  title: string;
  body?: string;
  bullets?: string[];
  planType?: string;
}) {
  return (
    <div className="bg-white rounded-[4px] p-7 shadow-sm border-t-[3px] border-ud-burgundy">
      <h3 className="text-lg font-bold text-ud-dark mb-2">{title}</h3>
      {body && <p className="text-sm text-ud-dark/65 font-light leading-relaxed">{body}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-ud-dark/70">
              <Check size={15} className="text-ud-burgundy flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {planType && <PlanShopTeaser type={planType} />}
    </div>
  );
}

// Section wrapper with an anchor id and alternating background.
export function ServiceSection({
  id,
  tone = "light",
  children,
}: {
  id?: string;
  tone?: "light" | "white";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${tone === "white" ? "bg-ud-white" : "bg-ud-light-gray"} py-16 md:py-24 scroll-mt-20`}>
      <div className="max-w-content mx-auto px-6">{children}</div>
    </section>
  );
}
