import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import StatBlock from "@/components/ui/StatBlock";
import { STATS, TEAM } from "@/lib/constants";
import CTABanner from "@/components/sections/CTABanner";

const VALUES = [
  {
    title: "Authentic",
    body: "We speak plainly and deliver honestly. No false promises, no inflated estimates — just real work done right.",
  },
  {
    title: "Innovative",
    body: "Infrastructure challenges evolve. We bring engineering creativity to terrain, timeline, and budget constraints that would stump others.",
  },
  {
    title: "Straightforward",
    body: "Our clients always know where their project stands. Clear reporting, honest timelines, and direct communication at every stage.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionHero
        title="About Ujenzi Dhabiti"
        subtitle="An infrastructure development company connecting Africa — built on honesty, experience, and a genuine belief in the continent's potential."
      />

      {/* Our Story */}
      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative h-80 md:h-[460px] rounded-[4px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=75&auto=format&fit=crop"
                alt="Ujenzi Dhabiti construction site"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-ud-dark/30" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-ud-burgundy text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-[4px]">
                  Est. 2009
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-ud-dark mb-6">
                From Nairobi to the Continent
              </h2>
              <div className="space-y-4 text-ud-dark/70 font-light leading-relaxed">
                <p>
                  Ujenzi Dhabiti began with a conviction: Africa&apos;s infrastructure gap is not a crisis to be managed — it&apos;s an opportunity to be seized. Founded in Nairobi, Kenya, we set out to deliver infrastructure projects that outlast the companies that build them.
                </p>
                <p>
                  Over fifteen years, we have grown from a local civil engineering outfit into a pan-African infrastructure company operating across eight countries. Roads, bridges, water systems, commercial buildings, and heavy logistics — we have delivered them all, in conditions that test every team we deploy.
                </p>
                <p>
                  We are headquartered at Manga House in Upperhill, Nairobi — at the center of Kenya&apos;s commercial and construction ecosystem. From here, we plan and coordinate projects from Kampala to Dar es Salaam to Kigali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-ud-burgundy p-10 md:p-12 rounded-[4px]">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-5">Mission</div>
              <p className="text-2xl md:text-3xl font-light text-ud-white leading-relaxed">
                To connect all economic sectors in Africa through infrastructural development.
              </p>
            </div>
            <div className="bg-ud-dark p-10 md:p-12 rounded-[4px]">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-5">Vision</div>
              <p className="text-2xl md:text-3xl font-light text-white/80 leading-relaxed">
                To spread infrastructural development across Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">
              What We Stand For
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">
              Our Brand Values
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((value, i) => (
              <div key={i} className="border-t-[3px] border-ud-burgundy pt-6">
                <h3 className="text-xl font-bold text-ud-dark mb-4">{value.title}</h3>
                <p className="text-ud-dark/60 font-light leading-relaxed">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ud-dark py-16">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((stat) => (
              <StatBlock key={stat.label} value={stat.value} label={stat.label} light />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">
              Leadership
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">
              Our Team
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-full aspect-[3/4] rounded-[4px] overflow-hidden bg-ud-light-gray mb-4">
                  <div className="absolute inset-0 flex items-center justify-center bg-ud-dark/5">
                    <UserCircle2 size={48} className="text-ud-burgundy opacity-30" strokeWidth={1} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-ud-burgundy" />
                </div>
                <h3 className="text-sm font-bold text-ud-dark">{member.name}</h3>
                <p className="text-xs text-ud-dark/50 mt-1">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
