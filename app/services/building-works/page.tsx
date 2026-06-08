import { Check } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { ServiceIntro, ServiceType, ServiceSection } from "@/components/services/ServicePrimitives";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";

export const metadata = {
  title: "Building Works — Ujenzi Dhabiti",
  description: "Residential and commercial construction, renovation & remodeling, and boundary wall construction across Kenya.",
};

const SUBNAV = [
  { label: "Residential", href: "#residential" },
  { label: "Commercial & Institutional", href: "#commercial" },
  { label: "Renovation & Remodeling", href: "#renovation" },
  { label: "Boundary Walls", href: "#boundary-walls" },
];

const RESIDENTIAL_TYPES = [
  { title: "Bungalows", planType: "Bungalow", body: "We construct well-designed bungalows that offer convenience, accessibility, and efficient use of space. Ideal for families, retirees, and rural or peri-urban developments, our bungalows emphasize functional layouts, natural lighting, and cost-effective construction without compromising quality." },
  { title: "Townhouses", planType: "Townhouse", body: "Our townhouses are designed for modern urban living, offering a balance between privacy and community. Built within controlled developments or gated estates, these homes feature efficient space planning, shared infrastructure, and contemporary finishes — making them ideal for both homeowners and rental investors." },
  { title: "Maisonettes", planType: "Maisonette", body: "We develop stylish and spacious maisonettes that provide the feel of a standalone home within a compact footprint. These multi-level homes are popular in urban and peri-urban areas, offering clear separation between living and private spaces while maximizing land use and property value." },
  { title: "Villas", planType: "Villa", body: "Ujenzi Dhabiti constructs premium villas designed for luxury living. These homes feature expansive layouts, high-end finishes, landscaped surroundings, and modern architectural designs. Ideal for high-end residential developments, gated communities, and diaspora investment projects seeking exclusivity and long-term value." },
];

const APARTMENT_TYPES = [
  { title: "Studio Apartments / Bedsitters", planType: "Studio Apartment", body: "We construct compact and affordable studio units (bedsitters) designed for students, young professionals, and urban tenants. These units maximize limited space while maintaining functionality, making them highly attractive for rental income in high-demand areas." },
  { title: "One-Bedroom Apartments", planType: "One-Bedroom Apartment", body: "Our one-bedroom units offer a balance between affordability and comfort. Designed for individuals and couples, these apartments provide practical living spaces with separate bedroom, kitchen, and living areas — making them a popular choice for long-term tenants." },
  { title: "Two-Bedroom Apartments", planType: "Two-Bedroom Apartment", body: "Ideal for small families and shared living, our two-bedroom apartments are designed for comfort and functionality. These units offer enhanced space, better privacy, and strong rental appeal in both urban and peri-urban locations." },
  { title: "Three-Bedroom Apartments", planType: "Three-Bedroom Apartment", body: "We develop spacious three-bedroom units suitable for larger families or premium rental markets. These apartments often include master en-suite bedrooms, larger living areas, and upgraded finishes, making them ideal for higher-end tenants and owner-occupiers." },
  { title: "Executive & Luxury Apartments", planType: "Executive Apartment", body: "For premium developments, we construct high-end apartments featuring superior finishes, modern amenities, and enhanced design elements. These units are ideal for upscale markets, corporate tenants, and diaspora investors targeting high-value rental income or resale opportunities." },
  { title: "Serviced Apartments", planType: "Serviced Apartment", body: "We also develop serviced apartments designed for short-term stays and hospitality-style living. These units cater to business travelers, expatriates, and tourists, offering fully equipped living spaces with added convenience and strong income potential." },
];

const COMMERCIAL_TYPES = [
  { title: "Warehouses & Industrial Facilities", planType: "Warehouse", body: "We construct durable, high-capacity warehouse and industrial facilities designed for logistics efficiency, storage optimization, and operational scalability.", bullets: ["High load-bearing structural systems", "Efficient loading and offloading access", "Optimized floor layouts for storage flow", "Adequate ventilation and lighting systems", "Compliance with safety and fire regulations"] },
  { title: "Strip Malls & Retail Centers", planType: "Strip Mall", body: "Ujenzi Dhabiti develops modern strip malls and neighborhood retail centers designed to attract foot traffic and maximize tenant visibility.", bullets: ["Strategic layout and storefront exposure", "Efficient parking design", "Flexible retail unit configurations", "Attractive façade finishes", "Infrastructure to support diverse tenants"] },
  { title: "Mixed-Use Developments", planType: "Mixed-Use", body: "We design and construct integrated mixed-use developments that combine residential, commercial, and retail spaces within one cohesive environment.", bullets: ["Functional zoning and circulation planning", "Structural adaptability for multiple uses", "Efficient vertical and horizontal integration", "Modern aesthetics with durable finishes", "Infrastructure planning for long-term sustainability"] },
  { title: "Office Buildings", planType: "Office Building", body: "We construct modern office spaces that enhance productivity, corporate identity, and operational efficiency — from standalone office blocks to multi-storey commercial buildings.", bullets: ["Flexible floor plate designs", "Efficient vertical circulation systems", "Professional façade treatments", "Energy-conscious design considerations", "Compliance with commercial building standards"] },
  { title: "Educational Facilities (Schools & Institutions)", planType: "School", body: "Ujenzi Dhabiti constructs safe, functional, and future-ready educational facilities tailored to learning excellence.", bullets: ["Classrooms and lecture halls", "Administration blocks", "Laboratories and specialized rooms", "Libraries and resource centers", "Sanitation and support infrastructure"] },
];

const RESIDENTIAL_RENOVATION = [
  { title: "Bungalows", body: "We upgrade bungalows to enhance space utilization, improve interior flow, and introduce modern finishes — including layout reconfiguration, roofing upgrades, kitchen and bathroom remodeling, and exterior enhancements." },
  { title: "Townhouses", body: "Our townhouse renovations focus on maximizing space, improving functionality, and updating finishes to meet modern urban living standards, increasing both comfort and rental value." },
  { title: "Maisonettes", body: "We remodel maisonettes to create more open, stylish, and functional living environments — modernizing kitchens, bathrooms, staircases, and living areas, and upgrading finishes and fixtures." },
  { title: "Villas", body: "For high-end properties, we deliver premium renovations that enhance luxury, comfort, and exclusivity — high-end interior upgrades, façade improvements, landscaping integration, and smart home enhancements." },
  { title: "Apartments & Multi-Unit Developments", body: "We renovate apartment blocks to improve tenant appeal, increase occupancy rates, and boost rental income — upgrading common areas, unit finishes, building exteriors, and layouts." },
];

const COMMERCIAL_RENOVATION = [
  { title: "Warehouses & Industrial Facilities", body: "We upgrade warehouses to improve operational efficiency, storage capacity, and safety standards — structural reinforcements, flooring upgrades, ventilation improvements, and layout optimization." },
  { title: "Strip Malls & Retail Centers", body: "Our retail renovations enhance customer experience, improve storefront appeal, and modernize shared spaces — upgrading façades, interiors, and infrastructure." },
  { title: "Mixed-Use Developments", body: "We remodel mixed-use properties to improve integration between residential, retail, and commercial spaces, focusing on functionality, circulation, and modern design." },
  { title: "Office Buildings", body: "We transform office spaces into modern, efficient work environments — interior reconfiguration, partitioning, lighting upgrades, and aesthetic improvements." },
  { title: "Schools & Educational Institutions", body: "We renovate educational facilities to improve safety, functionality, and learning environments — classroom upgrades, sanitation improvements, structural repairs, and modernization." },
];

const BOUNDARY_CLIENTS = [
  { title: "Residential Homes", body: "Boundary walls that provide homeowners with security, privacy, and visual appeal — decorative finishes, reinforced columns, secure gates, and modern design elements." },
  { title: "Schools & Educational Institutions", body: "Perimeter walls that ensure safety while maintaining an organized, professional campus appearance — controlled entry points, durable materials, and long-lasting finishes." },
  { title: "Hospitals & Healthcare Facilities", body: "Boundaries that balance safety, privacy, and accessibility — controlled entry points, emergency access considerations, and durable construction for high-traffic environments." },
  { title: "Commercial Properties & Businesses", body: "Walls that reinforce security while maintaining a professional, attractive exterior — strong structural systems, secure access gates, and visually appealing finishes." },
];

const BOUNDARY_WALL_TYPES = [
  { title: "Natural Stone Boundary Walls", body: "Exceptional durability and timeless aesthetic appeal, built using high-quality natural stone reinforced with structural columns. Ideal for homes, estates, schools, and institutions." },
  { title: "Reinforced Concrete Boundary Walls", body: "Strong perimeter protection and long-term structural integrity, reinforced with steel to withstand environmental pressures and security demands." },
  { title: "Precast Panel Boundary Walls", body: "A faster, cost-effective solution manufactured off-site and installed on location — ideal for large properties such as schools, warehouses, and institutional developments." },
  { title: "Decorative & Architectural Boundary Walls", body: "A balance of security and visual elegance, incorporating textured finishes, architectural patterns, and modern design elements." },
];

const SECURITY_ENHANCEMENTS = [
  { title: "Electric Fencing Integration", body: "An additional layer of security along boundary walls, widely used for residential estates, commercial properties, schools, and institutional facilities." },
  { title: "Razor Wire & Barbed Wire Protection", body: "Enhanced deterrence along the top of boundary walls — common for high-security facilities, warehouses, and large commercial premises." },
  { title: "Automated & Reinforced Gates", body: "Durable steel gates built for both security and convenience, with automated systems for controlled access to estates, businesses, and institutions." },
  { title: "Security Infrastructure Integration", body: "Provisions for CCTV mounting poles, lighting installations, guardhouses, and access control systems for a comprehensive perimeter solution." },
];

export default function BuildingWorksPage() {
  return (
    <>
      <SectionHero
        title="Building Works"
        subtitle="Residential and commercial construction, renovation & remodeling, and boundary walls — built to last."
      />

      {/* Sub-nav */}
      <div className="sticky top-16 md:top-20 z-30 bg-ud-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-content mx-auto px-6 flex gap-1 overflow-x-auto">
          {SUBNAV.map((item) => (
            <a key={item.href} href={item.href} className="whitespace-nowrap text-xs md:text-sm font-semibold text-white/70 hover:text-white py-4 px-3 border-b-2 border-transparent hover:border-ud-burgundy transition-colors">
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* ─── Residential ─────────────────────────────────────── */}
      <ServiceSection id="residential" tone="white">
        <ServiceIntro
          eyebrow="Building Works"
          title="Residential Construction & Housing Development"
          paragraphs={[
            "At Ujenzi Dhabiti, we design and build high-quality residential properties that combine comfort, durability, and long-term investment value. Whether for homeownership or income generation, our developments are tailored to meet the needs of both local clients and Kenyans in the diaspora seeking reliable, transparent, and professionally managed construction solutions.",
            "We understand the importance of trust, cost control, and timely delivery — especially for clients managing projects remotely. Our team ensures clear communication, strict quality standards, and full project oversight from concept to completion.",
            "From standalone homes to multi-unit residential developments, we create spaces that are functional, modern, and built to stand the test of time.",
          ]}
          tagline="Ujenzi Dhabiti — Building Homes. Creating Lasting Value."
        />

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Our Residential Property Solutions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {RESIDENTIAL_TYPES.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} planType={t.planType} />
          ))}
        </div>

        <div className="mt-12 bg-ud-light-gray rounded-[4px] p-7">
          <h3 className="text-lg font-bold text-ud-dark mb-2">Apartments & Multi-Unit Developments</h3>
          <p className="text-sm text-ud-dark/65 font-light leading-relaxed mb-4">
            We specialize in the construction of apartment blocks tailored for both rental income and property investment, designed with efficiency, tenant comfort, and long-term returns in mind.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {["Optimal unit layouts for maximum occupancy", "Strong structural systems for multi-storey buildings", "Modern finishes to attract tenants and buyers", "Compliance with building regulations and safety standards"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ud-dark/70">
                <Check size={15} className="text-ud-burgundy flex-shrink-0 mt-0.5" /><span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Types of Apartments We Build</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {APARTMENT_TYPES.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} planType={t.planType} />
          ))}
        </div>

        <div className="mt-12 bg-ud-dark rounded-[4px] p-8 md:p-10">
          <h3 className="text-xl font-bold text-ud-white mb-3">Built for Homeowners & Diaspora Investors</h3>
          <p className="text-sm text-white/70 font-light leading-relaxed mb-5 max-w-2xl">
            We recognize the growing demand from Kenyans abroad seeking to invest back home. Whether you are building your dream home or investing in rental property, we ensure your project is delivered with integrity, precision, and lasting value.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {["Transparent project reporting and updates", "Professional project management from start to finish", "Cost control and accountability", "Quality assurance at every stage"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-white/80">
                <Check size={15} className="text-ud-burgundy flex-shrink-0 mt-0.5" /><span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-ud-burgundy font-semibold italic">Ujenzi Dhabiti — Your Trusted Partner in Building Home and Investment in Kenya.</p>
        </div>
      </ServiceSection>

      {/* ─── Commercial & Institutional ──────────────────────── */}
      <ServiceSection id="commercial">
        <ServiceIntro
          eyebrow="Building Works"
          title="Commercial & Institutional Developments"
          paragraphs={[
            "At Ujenzi Dhabiti, we design and construct high-performance commercial and institutional properties that support economic growth and community development. Our portfolio spans retail, industrial, corporate, mixed-use, and educational facilities across urban and emerging markets.",
            "We combine structural integrity, efficient planning, and modern construction techniques to deliver developments that are both functional and future-ready.",
          ]}
        />
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {COMMERCIAL_TYPES.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} bullets={t.bullets} planType={t.planType} />
          ))}
        </div>
      </ServiceSection>

      {/* ─── Renovation & Remodeling ─────────────────────────── */}
      <ServiceSection id="renovation" tone="white">
        <ServiceIntro
          eyebrow="Building Works"
          title="Renovation & Remodeling Services"
          paragraphs={[
            "At Ujenzi Dhabiti, we breathe new life into existing spaces through professional renovation and remodeling solutions designed to enhance functionality, aesthetics, and long-term value — whether upgrading a home, modernizing a commercial space, or repositioning a property for better returns.",
            "We understand that renovation is not just about changing structures — it's about improving how spaces look, feel, and perform. From minor upgrades to complete property overhauls, we ensure minimal disruption, clear timelines, and exceptional finishes.",
          ]}
          tagline="Ujenzi Dhabiti — Reimagining Spaces. Restoring Value."
        />

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Residential Renovation & Remodeling</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESIDENTIAL_RENOVATION.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} />
          ))}
        </div>

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Commercial & Institutional Renovation</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMERCIAL_RENOVATION.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} />
          ))}
        </div>
        <p className="mt-10 text-ud-burgundy font-semibold italic">Ujenzi Dhabiti — Transforming Today&apos;s Spaces into Tomorrow&apos;s Standards.</p>
      </ServiceSection>

      {/* ─── Boundary Walls ──────────────────────────────────── */}
      <ServiceSection id="boundary-walls">
        <ServiceIntro
          eyebrow="Building Works"
          title="Boundary Wall Construction"
          paragraphs={[
            "At Ujenzi Dhabiti, we design and construct strong, secure, and aesthetically appealing boundary walls that provide protection, privacy, and a clear definition of property ownership. Our solutions combine structural strength with architectural appeal, ensuring security infrastructure also enhances the appearance and value of the property.",
            "Our services include site assessment, design consultation, structural construction, gate integration, and finishing works — ensuring every boundary project meets safety standards, functionality requirements, and visual appeal.",
          ]}
          tagline="Ujenzi Dhabiti — Securing Spaces with Strength and Style."
        />

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Our Boundary Wall Solutions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {BOUNDARY_CLIENTS.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} />
          ))}
        </div>

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Types of Boundary Walls We Construct</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {BOUNDARY_WALL_TYPES.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} />
          ))}
        </div>

        <h3 className="text-lg font-bold text-ud-dark mt-12 mb-6">Security Enhancements We Offer</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {SECURITY_ENHANCEMENTS.map((t) => (
            <ServiceType key={t.title} title={t.title} body={t.body} />
          ))}
        </div>
      </ServiceSection>

      <ServiceEnquiry projectType="Building Works — Residential" />
      <CTABanner />
    </>
  );
}
