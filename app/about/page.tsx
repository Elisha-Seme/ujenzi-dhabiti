import Image from "next/image";
import {
  ShieldCheck,
  Scale,
  Lightbulb,
  HeartHandshake,
  Leaf,
  Users,
  Layers,
  Target,
  Award,
  Wrench,
  Clock,
  UserCheck,
} from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import CTABanner from "@/components/sections/CTABanner";
import Logo from "@/components/layout/Logo";

const CORE_VALUES = [
  { icon: Award, title: "Quality Excellence", body: "We are committed to delivering strong, durable, and high-standard workmanship in every project." },
  { icon: Scale, title: "Integrity", body: "We uphold honesty, transparency, and accountability in all our dealings." },
  { icon: Lightbulb, title: "Innovation", body: "We embrace modern construction techniques and creative solutions to meet evolving client needs." },
  { icon: HeartHandshake, title: "Customer Focus", body: "We prioritize our clients by understanding their vision and delivering beyond expectations." },
  { icon: Leaf, title: "Sustainability", body: "We are dedicated to environmentally responsible practices and long-lasting developments." },
  { icon: Users, title: "Collaboration", body: "We work closely with clients, partners, and communities to achieve shared success." },
];

const WHY_CHOOSE_US = [
  { icon: Layers, title: "Integrated Solutions", body: "From construction and civil works to interior finishes and material supply, we offer end-to-end services under one roof." },
  { icon: Target, title: "Purpose-Driven Approach", body: "Our work goes beyond construction — we build to connect communities and improve livelihoods." },
  { icon: ShieldCheck, title: "Quality & Durability", body: "We prioritize strong, long-lasting structures that deliver value over time." },
  { icon: Wrench, title: "Experienced Team", body: "Our skilled professionals bring technical expertise and attention to detail to every project." },
  { icon: Clock, title: "Timely Delivery", body: "We understand the importance of deadlines and strive to complete projects efficiently without compromising quality." },
  { icon: UserCheck, title: "Client-Centered Execution", body: "We tailor our solutions to meet the unique needs of each client and project." },
];

export default function AboutPage() {
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
                <span className="text-lg font-bold text-ud-burgundy tracking-wide">Connecting Africa</span>
              </div>
            </div>
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
                To be a leading construction and infrastructure company in Africa, connecting communities through sustainable developments, modern transport networks, and quality housing solutions.
              </p>
            </div>
            <div className="bg-ud-dark p-10 md:p-12 rounded-[4px]">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-5">Our Mission</div>
              <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
                To deliver reliable, high-quality construction and civil works that enhance connectivity, support economic growth, and contribute to the development of safe, functional, and affordable living and working spaces across Africa.
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
            {CORE_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-ud-light-gray rounded-[4px] p-7 border-t-[3px] border-ud-burgundy">
                  <Icon className="w-7 h-7 text-ud-burgundy mb-4" strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-ud-dark mb-2">{value.title}</h3>
                  <p className="text-sm text-ud-dark/60 font-light leading-relaxed">{value.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-ud-dark py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-4">Our Story</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-white mb-8">
              Bridging Gaps in Infrastructure &amp; Housing
            </h2>
            <div className="space-y-5 text-white/70 font-light leading-relaxed text-lg">
              <p>
                Ujenzi Dhabiti Limited was established as a subsidiary of Ardhi Safi Limited with a clear and purposeful vision — to bridge critical gaps in infrastructure and housing across the region.
              </p>
              <p>
                Recognizing the growing need for improved transport networks, the company was founded to contribute to the development of roads and access systems that open up underserved areas. By enhancing connectivity, we aim to facilitate the efficient movement of people and goods, ultimately driving economic growth and regional development.
              </p>
              <p>
                At the same time, Ujenzi Dhabiti was created to support the mission of Ardhi Safi Limited — ensuring that every individual has access to a place they can call home. Through quality residential construction, we play a vital role in developing modern, secure, and comfortable living spaces.
              </p>
              <p>
                Together, these goals define who we are: a company committed to building structures that not only stand strong, but also connect people, opportunities, and communities across Africa.
              </p>
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
            {WHY_CHOOSE_US.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-[4px] p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-base font-bold text-ud-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-ud-dark/60 font-light leading-relaxed">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
          <div className="bg-ud-burgundy rounded-[4px] p-10 md:p-16 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-4">Our Commitment</div>
            <div className="space-y-5 text-white/85 font-light leading-relaxed text-lg max-w-3xl mx-auto">
              <p>
                At Ujenzi Dhabiti Limited, we are committed to delivering excellence in every project we undertake. We strive to build infrastructure and developments that enhance connectivity, improve living standards, and support economic growth.
              </p>
              <p>
                We are dedicated to maintaining the highest standards of quality, safety, and professionalism while fostering long-term relationships with our clients, partners, and communities.
              </p>
              <p className="text-ud-white font-normal">
                Through every road we construct and every building we develop, we remain true to our promise — Connecting Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
