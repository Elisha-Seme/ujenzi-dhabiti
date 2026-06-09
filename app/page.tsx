import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";
import HomeAuthTabs from "@/components/home/HomeAuthTabs";
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
      {/* ─── ONE continuous backdrop — no seams anywhere ─── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ud-dark" />
        {/* Blueprint, full-bleed at a constant opacity (same everywhere → no border) */}
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.6]" style={{ backgroundImage: "url('/bg-image.webp')" }} />
        {/* Burgundy MULTIPLY = the red blueprint. Vivid in the hero, then bleeds down and
            fades out gradually so it's gone by the Why-Choose-Us section (~90% down). */}
        <div
          className="absolute inset-0 bg-ud-burgundy mix-blend-multiply"
          style={{
            opacity: 0.9,
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.18) 75%, transparent 90%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 15%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.18) 75%, transparent 90%)",
          }}
        />
        {/* Red core + warm ambient glow toward centre-right — hero only */}
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(circle at 60% 50%, rgba(176,32,74,0.40), transparent 42%)" }} />
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(ellipse 75% 65% at 62% 52%, rgba(138,14,51,0.55), transparent 68%)" }} />
        {/* Hero vignettes — darken the left edge + top/bottom (the original look) */}
        <div className="absolute inset-x-0 top-0 h-[110vh]" style={{ background: "linear-gradient(to right, rgba(28,30,34,0.7), rgba(28,30,34,0.04) 45%, transparent)" }} />
        <div className="absolute inset-x-0 top-0 h-[110vh]" style={{ background: "linear-gradient(to bottom, rgba(28,30,34,0.45), transparent 28%, transparent 82%, rgba(28,30,34,0.45))" }} />
      </div>

      <div className="relative z-10">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div className="absolute bottom-10 right-6 md:right-12 opacity-70 hidden md:block z-[2]">
            <DotMatrix cols={14} rows={10} color="#ffffff" animate />
          </div>

          <div className="relative z-10 w-full max-w-content mx-auto px-6 pt-28 pb-16 md:pt-32 md:pb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
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

              <div className="flex lg:justify-end">
                <HomeAuthTabs />
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
