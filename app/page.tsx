import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";
import HomeCategories from "@/components/home/HomeCategories";
import HomeServices from "@/components/home/HomeServices";
import HomeProducts from "@/components/home/HomeProducts";
import HomePlansBand from "@/components/home/HomePlansBand";
import HomeProjects from "@/components/home/HomeProjects";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-ud-dark">
      {/* ─── One page-wide backdrop (sits BELOW the z-10 content, above the page bg) ─── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ud-dark" />
        {/* Blueprint texture — clearly visible across the page */}
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.7]" style={{ backgroundImage: "url('/bg-image.webp')" }} />
        {/* Deep burgundy MULTIPLIED over the blueprint → red lines in the hero, masked to fade out lower down */}
        <div
          className="absolute inset-x-0 top-0 h-[170vh] bg-ud-burgundy mix-blend-multiply opacity-90"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 32%, transparent 70%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 32%, transparent 70%)",
          }}
        />
        {/* Warm glows so the hero reads vivid red (like before) */}
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(circle at 58% 40%, rgba(176,32,74,0.38), transparent 46%)" }} />
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(ellipse 80% 62% at 56% 44%, rgba(138,14,51,0.5), transparent 70%)" }} />
        {/* Settle the very bottom into solid dark before Why-Choose-Us */}
        <div className="absolute inset-x-0 bottom-0 h-[45vh]" style={{ background: "linear-gradient(to bottom, rgba(28,30,34,0), rgba(28,30,34,0.92))" }} />
      </div>

      {/* ─── Content (above the backdrop) ─── */}
      <div className="relative z-10">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center">
          <div className="absolute bottom-10 right-6 md:right-12 opacity-70 hidden md:block">
            <DotMatrix cols={14} rows={10} color="#ffffff" animate />
          </div>
          <div className="w-full max-w-content mx-auto px-6 pt-28 pb-20 md:pt-32 md:pb-28">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-white/70 border border-white/25 px-3 py-1.5 rounded-[4px] mb-6">
                Connecting Africa
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-ud-white leading-tight mb-5">
                Building Materials &amp; Construction<br />
                <span className="text-white/75">Services Under One Roof</span>
              </h1>
              <p className="text-base md:text-lg text-white/75 font-light leading-relaxed mb-8 max-w-md">
                From foundation to finishing — we supply and build.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/shop" variant="primary">Shop Materials</Button>
                <Button href="/request-a-quote" variant="ghost">Request a Quote</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <HomeCategories />

        {/* Services Snapshot */}
        <HomeServices />

        {/* Featured Products */}
        <HomeProducts />

        {/* House Plans entry point */}
        <HomePlansBand />

        {/* Projects */}
        <HomeProjects />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* CTA Banner */}
        <CTABanner />
      </div>
    </div>
  );
}
