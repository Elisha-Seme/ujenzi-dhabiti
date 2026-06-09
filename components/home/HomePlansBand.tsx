import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

// Compact entry point to the house-plans store.
export default function HomePlansBand() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-[4px] bg-ud-burgundy p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-white/15 flex items-center justify-center flex-shrink-0">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Building from the ground up? Start with a plan.</h2>
              <p className="text-white/75 text-sm md:text-base mt-1.5 max-w-xl">
                Ready-to-build house plans — bungalows, maisonettes, apartments &amp; more. Buy as a digital download or a printed copy.
              </p>
            </div>
          </div>
          <Link href="/shop/plans" className="inline-flex items-center gap-2 bg-white text-ud-burgundy font-semibold px-6 py-3 rounded-[4px] hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0">
            Browse House Plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
