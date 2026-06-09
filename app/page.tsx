import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";
import BlueprintBg from "@/components/ui/BlueprintBg";
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
    <div className="relative">

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <BlueprintBg variant="hero" />
        {/* Fade hero into the dark zone below */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ud-dark z-[1] pointer-events-none" />
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

      {/* ─── Shop by Category (subtle blueprint bg) ─── */}
      <div className="relative overflow-hidden">
        <BlueprintBg variant="subtle" />
        <div className="relative z-10">
          <HomeCategories />
        </div>
      </div>

      {/* ─── Services Snapshot (subtle blueprint) ─── */}
      <div className="relative overflow-hidden">
        <BlueprintBg variant="subtle" />
        <div className="relative z-10">
          <HomeServices />
        </div>
      </div>

      {/* ─── Featured Products (subtle blueprint) ─── */}
      <div className="relative overflow-hidden">
        <BlueprintBg variant="subtle" />
        <div className="relative z-10">
          <HomeProducts />
        </div>
      </div>

      {/* ─── House Plans — plain dark, no blueprint ─── */}
      <HomePlansBand />

      {/* ─── Projects (subtle blueprint) ─── */}
      <div className="relative overflow-hidden">
        <BlueprintBg variant="subtle" />
        <div className="relative z-10">
          <HomeProjects />
        </div>
      </div>

      {/* ─── Why Choose Us — plain, no blueprint ─── */}
      <WhyChooseUs />

      {/* ─── CTA Banner — plain, no blueprint ─── */}
      <CTABanner />
    </div>
  );
}
