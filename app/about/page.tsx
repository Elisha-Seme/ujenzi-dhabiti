import Image from "next/image";
import * as LucideIcons from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import Logo from "@/components/layout/Logo";
import { db } from "@/lib/db";
import { systemSettings, coreValues, whyChooseUs, companyStats, teamMembers } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { STATS as STATS_STATIC, TEAM as TEAM_STATIC } from "@/lib/constants";

// Static placeholders for vision/mission/story copy
const VISION_STATIC = "To be a leading construction and infrastructure company in Africa, connecting communities through sustainable developments, modern transport networks, and quality housing solutions.";
const MISSION_STATIC = "To deliver reliable, high-quality construction and civil works that enhance connectivity, support economic growth, and contribute to the development of safe, functional, and affordable living and working spaces across Africa.";
const STORY_TITLE_STATIC = "Bridging Gaps in Infrastructure & Housing";
const STORY_PARAGRAPHS_STATIC = [
  "Ujenzi Dhabiti Limited was established as a subsidiary of Ardhi Safi Limited with a clear and purposeful vision — to bridge critical gaps in infrastructure and housing across the region.",
  "Recognizing the growing need for improved transport networks, the company was founded to contribute to the development of roads and access systems that open up underserved areas. By enhancing connectivity, we aim to facilitate the efficient movement of people and goods, ultimately driving economic growth and regional development.",
  "At the same time, Ujenzi Dhabiti was created to support the mission of Ardhi Safi Limited — ensuring that every individual has access to a place they can call home. Through quality residential construction, we play a vital role in developing modern, secure, and comfortable living spaces.",
  "Together, these goals define who we are: a company committed to building structures that not only stand strong, but also connect people, opportunities, and communities across Africa."
];
const COMMITMENT_PARAGRAPHS_STATIC = [
  "At Ujenzi Dhabiti Limited, we are committed to delivering excellence in every project we undertake. We strive to build infrastructure and developments that enhance connectivity, improve living standards, and support economic growth.",
  "We are dedicated to maintaining the highest standards of quality, safety, and professionalism while fostering long-term relationships with our clients, partners, and communities.",
  "Through every road we construct and every building we develop, we remain true to our promise — Connecting Africa."
];

// Static placeholders for values/choose-us in case database is empty or not configured
const CORE_VALUES_STATIC = [
  { iconName: "Award", title: "Quality Excellence", description: "We are committed to delivering strong, durable, and high-standard workmanship in every project." },
  { iconName: "Scale", title: "Integrity", description: "We uphold honesty, transparency, and accountability in all our dealings." },
  { iconName: "Lightbulb", title: "Innovation", description: "We embrace modern construction techniques and creative solutions to meet evolving client needs." },
  { iconName: "HeartHandshake", title: "Customer Focus", description: "We prioritize our clients by understanding their vision and delivering beyond expectations." },
  { iconName: "Leaf", title: "Sustainability", description: "We are dedicated to environmentally responsible practices and long-lasting developments." },
  { iconName: "Users", title: "Collaboration", description: "We work closely with clients, partners, and communities to achieve shared success." },
];

const WHY_CHOOSE_US_STATIC = [
  { iconName: "Layers", title: "Integrated Solutions", description: "From construction and civil works to interior finishes and material supply, we offer end-to-end services under one roof." },
  { iconName: "Target", title: "Purpose-Driven Approach", description: "Our work goes beyond construction — we build to connect communities and improve livelihoods." },
  { iconName: "ShieldCheck", title: "Quality & Durability", description: "We prioritize strong, long-lasting structures that deliver value over time." },
  { iconName: "Wrench", title: "Experienced Team", description: "Our skilled professionals bring technical expertise and attention to detail to every project." },
  { iconName: "Clock", title: "Timely Delivery", description: "We understand the importance of deadlines and strive to complete projects efficiently without compromising quality." },
  { iconName: "UserCheck", title: "Client-Centered Execution", description: "We tailor our solutions to meet the unique needs of each client and project." },
];

// Helper to resolve Lucide icon components dynamically
const DynamicIcon = ({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={className} strokeWidth={strokeWidth ?? 1.5} />;
  }
  return <IconComponent className={className} strokeWidth={strokeWidth ?? 1.5} />;
};

export default async function AboutPage() {
  let motto = "Connecting Africa";
  let vision = VISION_STATIC;
  let mission = MISSION_STATIC;
  let storyTitle = STORY_TITLE_STATIC;
  let storyParagraphs = STORY_PARAGRAPHS_STATIC;
  let commitmentParagraphs = COMMITMENT_PARAGRAPHS_STATIC;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let valuesList: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chooseUsList: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let statsList: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let teamList: any[] = [];

  try {
    const [settings] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.id, "default"));
    if (settings) {
      if (settings.motto) motto = settings.motto;
      if (settings.vision) vision = settings.vision;
      if (settings.mission) mission = settings.mission;
      if (settings.storyTitle) storyTitle = settings.storyTitle;
      if (settings.storyParagraphs && settings.storyParagraphs.length > 0) {
        storyParagraphs = settings.storyParagraphs;
      }
      if (settings.commitmentParagraphs && settings.commitmentParagraphs.length > 0) {
        commitmentParagraphs = settings.commitmentParagraphs;
      }
    }

    const dbValues = await db
      .select()
      .from(coreValues)
      .orderBy(asc(coreValues.sortOrder));
    if (dbValues && dbValues.length > 0) {
      valuesList = dbValues.map(v => ({
        title: v.title,
        description: v.description,
        iconName: v.iconName,
      }));
    } else {
      valuesList = CORE_VALUES_STATIC;
    }

    const dbChooseUs = await db
      .select()
      .from(whyChooseUs)
      .orderBy(asc(whyChooseUs.sortOrder));
    if (dbChooseUs && dbChooseUs.length > 0) {
      chooseUsList = dbChooseUs.map(c => ({
        title: c.title,
        description: c.description,
        iconName: c.iconName,
      }));
    } else {
      chooseUsList = WHY_CHOOSE_US_STATIC;
    }

    const dbStats = await db
      .select()
      .from(companyStats)
      .orderBy(asc(companyStats.sortOrder));
    if (dbStats && dbStats.length > 0) {
      statsList = dbStats;
    } else {
      statsList = STATS_STATIC;
    }

    const dbTeam = await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.sortOrder));
    if (dbTeam && dbTeam.length > 0) {
      teamList = dbTeam;
    } else {
      teamList = TEAM_STATIC;
    }
  } catch (err) {
    console.error("About page dynamic load failed, falling back to static constants:", err);
    valuesList = CORE_VALUES_STATIC;
    chooseUsList = WHY_CHOOSE_US_STATIC;
    statsList = STATS_STATIC;
    teamList = TEAM_STATIC;
  }

  return (
    <>
      <SectionHero
        title="About Ujenzi Dhabiti"
        subtitle="A forward-thinking construction and infrastructure company — a proud subsidiary of Ardhi Safi Limited."
      />

      {/* Company Overview */}
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
                  Subsidiary of Ardhi Safi Ltd
                </span>
              </div>
            </div>
            <div>
              <Logo variant="light" className="h-10 w-auto mb-6" />
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">
                Company Overview
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-ud-dark mb-6">
                Building Works, Civil Works &amp; Interior Design
              </h2>
              <div className="space-y-4 text-ud-dark/70 font-light leading-relaxed">
                <p>
                  Ujenzi Dhabiti Limited is a forward-thinking construction and infrastructure company, and a proud subsidiary of Ardhi Safi Limited. We specialize in delivering high-quality building works, civil engineering solutions, and interior design services tailored to meet the diverse needs of residential, commercial, and institutional clients.
                </p>
                <p>
                  Guided by our commitment to strength, durability, and innovation, we focus on developing infrastructure and spaces that not only meet today&apos;s needs but also contribute to long-term growth and sustainability.
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-3 border border-ud-burgundy/30 rounded-[4px] px-5 py-3">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-ud-dark/40">Our Motto</span>
                <span className="text-lg font-bold text-ud-burgundy tracking-wide">{motto}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-14 border-y border-ud-dark/5 shadow-sm">
        <div className="max-w-content mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsList.map((stat, idx) => (
              <div key={stat.id || idx}>
                <div className="text-3xl md:text-4xl font-extrabold text-ud-burgundy">{stat.value}</div>
                <div className="text-xs md:text-sm font-semibold uppercase tracking-wider text-ud-dark/50 mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-ud-burgundy p-10 md:p-12 rounded-[4px]">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-5">Our Vision</div>
              <p className="text-xl md:text-2xl font-light text-ud-white leading-relaxed">
                {vision}
              </p>
            </div>
            <div className="bg-ud-dark p-10 md:p-12 rounded-[4px]">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-5">Our Mission</div>
              <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
                {mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">
              What We Stand For
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {valuesList.map((val, idx) => (
              <div key={val.title || idx} className="bg-ud-light-gray rounded-[4px] p-7 border-t-[3px] border-ud-burgundy">
                <DynamicIcon name={val.iconName} className="w-7 h-7 text-ud-burgundy mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-ud-dark mb-2">{val.title}</h3>
                <p className="text-sm text-ud-dark/60 font-light leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-ud-dark py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">Our Story</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-white mb-8">
              {storyTitle}
            </h2>
            <div className="space-y-5 text-white/70 font-light leading-relaxed text-lg">
              {storyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-ud-light-gray py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">
              The Ujenzi Dhabiti Difference
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">Why Choose Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {chooseUsList.map((item, idx) => (
              <div key={item.title || idx} className="bg-white rounded-[4px] p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mb-4">
                  <DynamicIcon name={item.iconName} className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-ud-dark mb-2">{item.title}</h3>
                <p className="text-sm text-ud-dark/60 font-light leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="bg-ud-white py-20 md:py-28 border-t border-ud-dark/5">
        <div className="max-w-content mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">Our Leadership Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamList.map((member, idx) => (
              <div key={member.name || idx} className="text-center group">
                <div className="relative h-72 rounded-[4px] overflow-hidden bg-ud-light-gray mb-4 border border-ud-dark/10 shadow-sm">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ud-burgundy/5 text-ud-burgundy text-5xl font-bold uppercase">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-ud-dark">{member.name}</h3>
                <p className="text-xs text-ud-dark/50 font-semibold uppercase tracking-wider mt-1">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="bg-ud-white py-20 md:py-28 border-t border-ud-dark/5">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-ud-burgundy rounded-[4px] p-10 md:p-16 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-4">Our Commitment</div>
            <div className="space-y-5 text-white/85 font-light leading-relaxed text-lg max-w-3xl mx-auto">
              {commitmentParagraphs.map((p, idx) => (
                <p key={idx} className={idx === commitmentParagraphs.length - 1 ? "text-ud-white font-normal animate-pulse" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
