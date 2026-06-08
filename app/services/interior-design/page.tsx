import { Check } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import { ServiceIntro, ServiceType, ServiceSection } from "@/components/services/ServicePrimitives";
import ServiceEnquiry from "@/components/services/ServiceEnquiry";

export const metadata = {
  title: "Interior Design — Ujenzi Dhabiti",
  description: "Office partitioning and glass & aluminum works for residential and commercial spaces in Kenya.",
};

const SUBNAV = [
  { label: "Office Partitioning", href: "#office-partitioning" },
  { label: "Glass & Aluminum", href: "#glass-aluminum" },
];

const PARTITION_TYPES = [
  { title: "Gypsum (Drywall) Partitions", body: "Durable, sound-insulated walls with a smooth finish ready for paint or wallpaper — a professional, solid feel at cost efficiency. Best for private offices, boardrooms, and quiet workspaces." },
  { title: "Glass Partitions (Frameless & Framed)", body: "A modern, sleek look that keeps an open, collaborative feel and lets natural light flow through. Clear, frosted, tinted, or branded finishes. Best for corporate offices, start-ups, co-working, and executive offices." },
  { title: "Aluminum & Glass Partition Systems", body: "Aluminum frames with glass panels for a strong yet elegant, highly customizable system that can match your brand colors. Best for mid- to high-end offices seeking durability and aesthetics." },
  { title: "Modular (Demountable) Partitions", body: "Flexible, reusable systems that install, move, or reconfigure without major construction — saving time and cost. Best for growing companies, tech firms, and dynamic work environments." },
  { title: "Wooden (Timber) Partitions", body: "Warmth, elegance, and a premium feel in full timber or engineered wood (MDF, laminated), customizable with shelves or acoustic panels. Best for executive offices, law firms, and high-end corporate spaces." },
  { title: "Acoustic (Soundproof) Partitions", body: "High-quality sound-insulating materials that minimize noise transfer for privacy and noise control. Best for boardrooms, HR offices, call centers, and studios." },
  { title: "PVC & Lightweight Partitions", body: "A cost-effective, quick solution that is lightweight, easy to install, and moisture-resistant. Best for budget-conscious projects, temporary offices, and back-office sections." },
  { title: "Sliding & Folding Partitions", body: "Flexibility to open up or close off spaces as needed — ideal where space utilization is key. Best for conference rooms, training spaces, and event areas." },
  { title: "Half-Height (Cubicle) Partitions", body: "Individual workstations that keep an open-office feel and improve organization. Best for open-plan offices, customer service teams, and co-working spaces." },
];

const GLASS_TYPES = [
  { title: "Aluminum Windows", body: "Durable, stylish, low-maintenance windows in sliding, casement, tilt-and-turn, and louvered designs — corrosion-resistant, secure, with custom sizes, colors, and finishes. Ideal for homes, apartments, offices, and schools." },
  { title: "Aluminum Doors", body: "Sliding, hinged (swing), and office/commercial entrance doors that enhance accessibility, security, and visual appeal. Ideal for residential homes, offices, and retail spaces." },
  { title: "Glass Office Partitions & Interior Glazing", body: "Frameless and framed systems with clear, frosted, or branded finishes that maximize natural light and space utilization. Ideal for offices, boardrooms, and co-working spaces." },
  { title: "Curtain Walling & Glass Facades", body: "Non-structural glass facades for a contemporary, high-end exterior that improves lighting and energy efficiency. Ideal for office blocks, malls, and commercial developments." },
  { title: "Shopfronts & Commercial Glass", body: "Frameless glass shopfronts and toughened safety glass with secure locking that maximize product visibility. Ideal for retail shops, showrooms, and restaurants." },
  { title: "Shower Cubicles", body: "Frameless, semi-frameless, sliding, and hinged glass shower cubicles — stylish, durable, and easy to maintain. Ideal for homes, apartments, and hotels." },
  { title: "Glass Balustrades & Railings", body: "Toughened safety glass with aluminum or stainless-steel support — a clean, minimalist look for staircases, balconies, and terraces. Ideal for homes, apartments, and commercial buildings." },
  { title: "Aluminum Louvers & Ventilation", body: "Durable, weather-resistant louver systems that ensure airflow without compromising security. Ideal for utility areas, commercial buildings, and industrial spaces." },
  { title: "Skylights & Roof Glazing", body: "Systems that brighten interiors while reducing energy costs, designed for both beauty and performance. Ideal for homes, offices, malls, and atriums." },
  { title: "Mirrors & Decorative Glass", body: "Supply and installation of high-quality mirrors and decorative glass that enhance interiors with style and depth. Ideal for homes, hotels, retail, and feature walls." },
];

export default function InteriorDesignPage() {
  return (
    <>
      <SectionHero
        title="Interior Design"
        subtitle="Office partitioning and precision glass & aluminum works — modern finishes, durable solutions, timeless appeal."
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

      {/* Office Partitioning */}
      <ServiceSection id="office-partitioning" tone="white">
        <ServiceIntro
          eyebrow="Interior Design"
          title="Office Partitioning Services"
          paragraphs={[
            "At Ujenzi Dhabiti Ltd, we transform open spaces into functional, stylish, and productive work environments through expertly designed office partitioning solutions — tailored to enhance privacy, optimize space, and reflect your brand identity while remaining cost-effective.",
            "We offer a wide range of modern office partitioning systems, each designed to suit different operational needs, aesthetics, and budgets.",
          ]}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {PARTITION_TYPES.map((t) => <ServiceType key={t.title} title={t.title} body={t.body} />)}
        </div>

        <div className="mt-12 bg-ud-light-gray rounded-[4px] p-7">
          <h3 className="text-lg font-bold text-ud-dark mb-2">Why Choose Ujenzi Dhabiti Ltd?</h3>
          <p className="text-sm text-ud-dark/65 font-light leading-relaxed mb-4">
            We understand the Kenyan market — balancing quality, cost, and practicality. From small office fit-outs to large corporate spaces, we deliver partitioning that is functional, modern, and built to last.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2">
            {["Efficient space planning and design", "High-quality materials suited for local conditions", "Timely project delivery", "Custom solutions tailored to your brand and workflow"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-ud-dark/70">
                <Check size={15} className="text-ud-burgundy flex-shrink-0 mt-0.5" /><span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </ServiceSection>

      {/* Glass & Aluminum */}
      <ServiceSection id="glass-aluminum">
        <ServiceIntro
          eyebrow="Interior Design"
          title="Glass & Aluminum Works"
          paragraphs={[
            "At Ujenzi Dhabiti Ltd, we deliver high-quality glass and aluminum solutions that enhance the beauty, functionality, and value of both residential and commercial properties.",
            "Our systems are designed to meet the demands of the Kenyan environment — balancing durability, security, energy efficiency, and modern aesthetics. Whether it's a sleek office façade or elegant home fittings, we provide precision-crafted installations that stand the test of time.",
          ]}
          tagline="Modern Finishes. Durable Solutions. Timeless Appeal."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {GLASS_TYPES.map((t) => <ServiceType key={t.title} title={t.title} body={t.body} />)}
        </div>
      </ServiceSection>

      <ServiceEnquiry projectType="Interior Design — Office Partitioning" />
      <CTABanner />
    </>
  );
}
