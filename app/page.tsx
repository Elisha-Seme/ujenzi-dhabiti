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
    <div className="relative isolate bg-ud-dark">
      {/* (A) Blueprint — FIXED to the viewport so its scale is identical in every
          section (never zoomed) and there are no seams between sections. */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg-image.webp')", opacity: 0.5 }} />
      </div>

      {/* (B) Red overlay — page-positioned, vivid in the hero, fading out gradually
          by the Why-Choose-Us section. Scrolls with the page. */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-0 h-[460vh] overflow-hidden pointer-events-none">
        {/* Burgundy multiply turns the blueprint deep red, easing away down the page */}
        <div
          className="absolute inset-0 bg-ud-burgundy mix-blend-multiply opacity-90"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 12%, rgba(0,0,0,0.45) 45%, transparent 92%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 12%, rgba(0,0,0,0.45) 45%, transparent 92%)",
          }}
        />
        {/* Hero glows (centre-right) */}
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(circle at 60% 46%, rgba(176,32,74,0.40), transparent 44%)" }} />
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(ellipse 75% 60% at 62% 48%, rgba(138,14,51,0.55), transparent 68%)" }} />
        {/* Hero vignettes — darken the left edge + top a touch so the red pools centre-right */}
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "linear-gradient(to right, rgba(28,30,34,0.70), rgba(28,30,34,0.05) 45%, transparent)" }} />
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "linear-gradient(to bottom, rgba(28,30,34,0.45), transparent 30%)" }} />
      </div>

      <div className="relative z-10">
        {/* ─── Hero ─── */}
        <section className="relative min-h-screen flex items-center">
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
