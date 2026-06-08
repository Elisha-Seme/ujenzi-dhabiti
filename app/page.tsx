import Button from "@/components/ui/Button";
import DotMatrix from "@/components/ui/DotMatrix";
import BlueprintBg from "@/components/ui/BlueprintBg";
import HomeAuthTabs from "@/components/home/HomeAuthTabs";
import HomeProducts from "@/components/home/HomeProducts";
import HomePlans from "@/components/home/HomePlans";
import MissionVision from "@/components/sections/MissionVision";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ServicesGrid from "@/components/sections/ServicesGrid";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Faded blueprint watermark across the page */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/bg-image.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ud-white/94" />
      </div>

      {/* ─── Hero — vivid blueprint (brand "Core Identity" look) ─── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <BlueprintBg variant="hero" />
        {/* Fade the vivid hero into solid dark so the calmer zone below joins seamlessly */}
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

      {/* ─── Calmer dark zone — Materials & Equipment + House Plans ─── */}
      <div className="relative overflow-hidden">
        <BlueprintBg variant="subtle" />
        {/* Fade into the solid-dark Mission section below */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ud-dark z-[1] pointer-events-none" />
        <div className="relative z-10">
          <HomeProducts />
          <HomePlans />
        </div>
      </div>

      {/* ─── Company sections ──────────────────────────────────── */}
      <MissionVision />
      <WhyChooseUs />
      <ServicesGrid preview />
      <CTABanner />
    </div>
  );
}
