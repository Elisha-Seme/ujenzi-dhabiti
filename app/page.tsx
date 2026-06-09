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
      {/* Burgundy wash that carries the hero's colour down the page and fades out
          before the Why-Choose-Us section. Sits behind the content (z-0). */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-0 h-[430vh] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(106,0,37,0.45) 0%, rgba(106,0,37,0.24) 26%, rgba(106,0,37,0.08) 56%, rgba(28,30,34,0) 84%)" }}
      />

      <div className="relative z-10">
        {/* ─── Hero — premium layered architectural overlay ─── */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Backdrop: multiple layered gradients over the blueprint (kept visible) */}
          <div aria-hidden className="absolute inset-0">
            {/* deep charcoal base */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #121319 0%, #1c1e22 55%, #121319 100%)" }} />
            {/* blueprint artwork — preserved, cover-scaled to the hero so it never zooms */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg-image.webp')", opacity: 0.55 }} />
            {/* burgundy ambient glow radiating from centre-right (animated) */}
            <div className="absolute inset-0 hero-glow" style={{ background: "radial-gradient(ellipse 62% 58% at 66% 46%, rgba(139,0,53,0.55), transparent 62%)" }} />
            {/* brighter red core */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 63% 48%, rgba(176,32,74,0.30), transparent 40%)" }} />
            {/* gentle light diffusion — centre stays a touch brighter */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 42% at 60% 45%, rgba(255,255,255,0.05), transparent 60%)" }} />
            {/* cinematic atmospheric haze — soft, blurred, slow-drifting volumetric fog (no particles) */}
            <div className="absolute inset-0 hero-haze-a" style={{ background: "radial-gradient(42% 52% at 34% 28%, rgba(255,255,255,0.06), transparent 70%)", filter: "blur(42px)" }} />
            <div className="absolute inset-0 hero-haze-b" style={{ background: "radial-gradient(46% 56% at 70% 64%, rgba(176,32,74,0.13), transparent 72%)", filter: "blur(54px)" }} />
            {/* vignette — darken corners/edges to focus the hero */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 92% 92% at 56% 50%, transparent 45%, rgba(10,12,18,0.58) 100%)" }} />
            {/* left scrim — keep the headline highly readable */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,12,18,0.72), rgba(10,12,18,0.12) 42%, transparent 66%)" }} />
            {/* settle the bottom into the dark page below — no seam */}
            <div className="absolute inset-x-0 bottom-0 h-44" style={{ background: "linear-gradient(to bottom, transparent, #1c1e22)" }} />
          </div>

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
