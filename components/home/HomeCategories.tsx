import Link from "next/link";
import {
  Blocks,
  Layers,
  PaintBucket,
  Grid3x3,
  Droplets,
  Zap,
  Construction,
  Hammer,
} from "lucide-react";
import { PRODUCT_CATEGORIES, CATEGORY_META } from "@/lib/products";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  blocks: Blocks,
  ceiling: Layers,
  paint: PaintBucket,
  tiles: Grid3x3,
  pipe: Droplets,
  plug: Zap,
  road: Construction,
  tools: Hammer,
};

// "Shop by Category" — quick visual entry points into the materials shop.
export default function HomeCategories() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/55 mb-2">Shop by Category</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Everything Your Site Needs</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {PRODUCT_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = ICONS[meta.icon] ?? Blocks;
            return (
              <Link
                key={cat}
                href={`/shop/category/${cat.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
                className="group flex flex-col gap-2 rounded-[4px] border border-white/10 bg-white/[0.03] hover:bg-ud-burgundy hover:border-ud-burgundy p-4 transition-colors"
              >
                <div className="w-10 h-10 rounded-[4px] bg-ud-burgundy/20 group-hover:bg-white/15 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-ud-burgundy group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-snug">{cat}</p>
                  <p className="text-[11px] text-white/55 group-hover:text-white/80 leading-snug mt-0.5 transition-colors">{meta.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
