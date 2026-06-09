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
    <div className="relative bg-ud-dark overflow-hidden">
      {/* One page-wide backdrop: faint blueprint + a red wash up top that fades
          smoothly to dark over more than a screen — no seams, dark all the way down. */}
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-ud-dark" />
        {/* Clearly-visible blueprint texture across the page */}
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.6]" style={{ backgroundImage: "url('/bg-image.webp')" }} />
        {/* Deep burgundy, MULTIPLIED so the blueprint shows through as red lines — strong at the top, fading to plain dark lower down */}
        <div
          className="absolute inset-x-0 top-0 h-[175vh] bg-ud-burgundy mix-blend-multiply"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 66%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 66%)",
          }}
        />
        {/* warm glow in the hero */}
        <div className="absolute inset-x-0 top-0 h-screen" style={{ background: "radial-gradient(ellipse 75% 55% at 55% 32%, rgba(176,32,74,0.32), transparent 70%)" }} />
        {/* settle the very bottom into solid dark */}
        <div className="absolute inset-x-0 bottom-0 h-[40vh]" style={{ background: "linear-gradient(to bottom, rgba(28,30,34,0), rgba(28,30,34,0.85))" }} />
      </div>

      {/* ─── Hero ─────────────────────────────────────────────── */}
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

      {/* ─── Shop by Category ─────────────────────────────────── */}
      <HomeCategories />

      {/* ─── Services Snapshot ────────────────────────────────── */}
      <HomeServices />

      {/* ─── Featured Products ────────────────────────────────── */}
      <HomeProducts />

      {/* ─── House Plans entry point ──────────────────────────── */}
      <HomePlansBand />

      {/* ─── Projects ─────────────────────────────────────────── */}
      <HomeProjects />

      {/* ─── Why Choose Us ────────────────────────────────────── */}
      <WhyChooseUs />

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      <CTABanner />
    </div>
  );
}
