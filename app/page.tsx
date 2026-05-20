import HeroSection from "@/components/sections/HeroSection";
import MissionVision from "@/components/sections/MissionVision";
import ServicesGrid from "@/components/sections/ServicesGrid";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import ClientsStrip from "@/components/sections/ClientsStrip";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionVision />
      <ServicesGrid preview />
      <WhyChooseUs />
      <ProjectsGrid preview />
      <ClientsStrip />
      <CTABanner />
    </>
  );
}
