import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { ServiceIntro, ServiceType, ServiceSection } from "@/components/services/ServicePrimitives";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";

export const metadata = {
  title: "Civil Works — Ujenzi Dhabiti",
  description: "Murram road construction, cabro paving, and road drainage systems across Nairobi and Kenya.",
};

const SUBNAV = [
  { label: "Murram Roads", href: "#murram-roads" },
  { label: "Cabro Paving", href: "#cabro-paving" },
  { label: "Road Drainage", href: "#road-drainage" },
];

const MURRAM_TYPES = [
  { title: "Standard Compacted Murram Roads", body: "The most common type, constructed using well-selected lateritic material that is spread, graded, and mechanically compacted. Ideal for residential estates, access roads to plots and developments, and light to moderate traffic areas." },
  { title: "Heavy-Duty Murram Roads", body: "Reinforced with thicker murram layers and improved subgrade stabilization for high traffic volumes or heavy vehicles. Suitable for construction sites, industrial zones, and quarry and agricultural transport routes." },
  { title: "Graded and Shaped Murram Roads", body: "Focused on proper profiling and shaping to enhance water runoff and driving comfort, graded to the correct camber and alignment. Best for rural and peri-urban access roads, large land subdivisions, and temporary access routes." },
  { title: "Murram Roads with Drainage Systems", body: "Integrated with effective drainage features such as side drains, mitre drains, and culverts. Ideal for flood-prone areas, sloped terrains, and regions with heavy rainfall." },
  { title: "Stabilized Murram Roads", body: "Enhanced using stabilizing agents such as cement, lime, or mechanical stabilization to improve strength and reduce dust. Recommended for high-traffic access roads, weak soils, and longer-lasting solutions." },
  { title: "Estate and Internal Access Murram Roads", body: "Designed for residential developments, prioritizing smooth finishes, proper drainage, and aesthetic integration. Perfect for gated communities, apartment complexes, and mixed-use developments." },
];

const CABRO_TYPES = [
  { title: "Driveway Cabro Paving", body: "Durable and visually appealing cabro driveways for residential and commercial properties — homes, apartment complexes, and office premises — built to handle vehicle traffic while enhancing curb appeal." },
  { title: "Parking Yard Cabro Paving", body: "Cabro-paved parking areas designed for high traffic and efficient space utilization. Suitable for commercial buildings, shopping centers, and office complexes." },
  { title: "Walkways & Pedestrian Paths", body: "Elegant cabro walkways and footpaths providing safe and attractive pedestrian access for residential compounds, gardens and landscapes, and public spaces." },
  { title: "Estate Roads & Internal Cabro Roads", body: "A premium alternative to murram or tarmac for gated communities, residential estates, and mixed-use developments — a clean, organized look with durability and ease of maintenance." },
  { title: "Commercial & Industrial Yards", body: "Heavy-duty cabro paving for areas subjected to intense use and heavy loads — warehouses, industrial compounds, and loading and offloading zones." },
  { title: "Decorative & Patterned Cabro Paving", body: "Customized decorative designs for landscaping projects, courtyards and patios, and hospitality spaces, with a variety of colors, shapes, and patterns." },
  { title: "Cabro Paving Repairs & Maintenance", body: "Restoration of damaged or worn-out surfaces — re-leveling sunken areas, replacing broken blocks, and improving drainage to extend the lifespan of paved surfaces." },
];

const DRAINAGE_TYPES = [
  { title: "Side Drains (Open Channel Drains)", body: "Constructed alongside roads to channel surface water away from the road structure. Ideal for urban and rural roads, estate roads, and high rainfall areas." },
  { title: "Culvert Installation", body: "Pipe, box, and arch culverts that allow water to pass beneath roads, ensuring uninterrupted natural water flow at road crossings, drainage channels, and flood-prone areas." },
  { title: "Storm Water Drainage Systems", body: "Underground drainage pipes, catch basins, inlets, and manholes that manage runoff during heavy rainfall — best for urban developments, commercial properties, and high-density estates." },
  { title: "Mitre Drains", body: "Divert water from side drains into surrounding land, reducing water pressure along the road. Ideal for sloped terrain and rural and murram roads." },
  { title: "French Drains (Subsurface Drainage)", body: "Manage underground water and prevent waterlogging in areas with poor soil drainage, road foundations prone to water retention, and landscaped environments." },
  { title: "Concrete Drainage Channels", body: "Reinforced concrete channels for high-capacity water flow and long-term durability — best for high-traffic urban roads, industrial areas, and commercial developments." },
  { title: "Gabion Drainage & Erosion Control", body: "Gabion structures that control erosion and stabilize drainage paths in areas prone to soil movement — riverbanks, sloped landscapes, and high runoff velocity." },
  { title: "Drainage Maintenance & Rehabilitation", body: "Clearing blocked drains, reconstructing damaged channels, and improving drainage flow to ensure optimal performance and prevent costly repairs." },
];

export default function CivilWorksPage() {
  return (
    <>
      <SectionHero
        title="Civil Works"
        subtitle="Durable roads, paving, and drainage engineered for Kenya's terrain and climate."
      />

      <div className="sticky top-16 md:top-20 z-30 bg-ud-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-content mx-auto px-6 flex gap-1 overflow-x-auto">
          {SUBNAV.map((item) => (
            <a key={item.href} href={item.href} className="whitespace-nowrap text-xs md:text-sm font-semibold text-white/70 hover:text-white py-4 px-3 border-b-2 border-transparent hover:border-ud-burgundy transition-colors">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Murram Roads */}
      <ServiceSection id="murram-roads" tone="white">
        <ServiceIntro
          eyebrow="Civil Works"
          title="Murram Road Construction"
          paragraphs={[
            "At Ujenzi Dhabiti, we specialize in the construction of high-quality murram roads designed to provide durable, cost-effective, and reliable access across residential, commercial, agricultural, and industrial developments — an ideal solution where tarmac may not be immediately necessary.",
            "Our approach combines proper subgrade preparation, high-quality murram selection, expert grading, and effective drainage systems to ensure long-lasting roads that withstand heavy use and varying weather conditions common across Kenya.",
          ]}
        />
        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Types of Murram Roads We Construct</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {MURRAM_TYPES.map((t) => <ServiceType key={t.title} title={t.title} body={t.body} />)}
        </div>
      </ServiceSection>

      {/* Cabro Paving */}
      <ServiceSection id="cabro-paving">
        <ServiceIntro
          eyebrow="Civil Works"
          title="Cabro Paving"
          paragraphs={[
            "At Ujenzi Dhabiti, we specialize in high-quality cabro paving solutions that combine durability, functionality, and aesthetic appeal. Cabro (concrete block paving) is one of the most preferred surfacing options in Kenya due to its strength, ease of maintenance, and ability to enhance the visual value of any property.",
            "Our team delivers expertly installed cabro surfaces using precision leveling, proper base preparation, and high-quality paving blocks for long-lasting performance under both light and heavy use.",
          ]}
        />
        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Types of Cabro Paving Works We Offer</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {CABRO_TYPES.map((t) => <ServiceType key={t.title} title={t.title} body={t.body} />)}
        </div>
      </ServiceSection>

      {/* Road Drainage */}
      <ServiceSection id="road-drainage" tone="white">
        <ServiceIntro
          eyebrow="Civil Works"
          title="Road Drainage Systems"
          paragraphs={[
            "At Ujenzi Dhabiti, we specialize in the design and construction of road drainage systems in Kenya, ensuring roads remain durable, safe, and functional throughout all weather conditions. Proper drainage is critical in preventing flooding, erosion, and premature road failure.",
            "We deliver efficient, long-lasting drainage solutions by combining engineering expertise, quality materials, and a deep understanding of local terrain and water flow patterns.",
          ]}
        />
        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Types of Drainage Systems We Construct</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {DRAINAGE_TYPES.map((t) => <ServiceType key={t.title} title={t.title} body={t.body} />)}
        </div>
      </ServiceSection>

      <ServiceEnquiry projectType="Civil Works — Murram Road" />
      <CTABanner />
    </>
  );
}
