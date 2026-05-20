import SectionHero from "@/components/ui/SectionHero";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import CTABanner from "@/components/sections/CTABanner";

export default function ProjectsPage() {
  return (
    <>
      <SectionHero
        title="Our Projects"
        subtitle="Delivering infrastructure that connects communities, drives commerce, and builds nations."
      />
      <ProjectsGrid />
      <CTABanner />
    </>
  );
}
