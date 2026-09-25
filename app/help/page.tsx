import Link from "next/link";
import * as LucideIcons from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import { CONTACT_INFO, EMAIL_DIRECTORY, whatsappLink } from "@/lib/constants";
import { db } from "@/lib/db";
import { faqs, systemSettings } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// ── Help Center structure modelled on the client-approved Grainger Help Desk
// reference: Self-Service tiles → Popular Topics link columns → FAQ (retained)
// → "How can I contact us?" tiles → email directory (retained).

const SELF_SERVICE = [
  { icon: "PackageSearch", label: "Track Order / Review Order History", href: "/track" },
  { icon: "FileText", label: "View My Orders & Invoices", href: "/account/orders" },
  { icon: "Settings", label: "Update My Account Info", href: "/account/profile" },
];

const POPULAR_TOPICS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Placing Orders",
    links: [
      { label: "Request a Quote", href: "/request-a-quote" },
      { label: "Shop Building Materials", href: "/shop" },
      { label: "House Plans", href: "/shop/plans" },
      { label: "Saved Carts", href: "/account/saved-carts" },
    ],
  },
  {
    heading: "Order Information",
    links: [
      { label: "Order Tracking", href: "/track" },
      { label: "Delivery Estimator & Zones", href: "/shop" },
      { label: "My Quotes", href: "/account/quotes" },
      { label: "Returns & Cancellations", href: "/contact" },
    ],
  },
  {
    heading: "Account Settings",
    links: [
      { label: "My Profile", href: "/account/profile" },
      { label: "Delivery Addresses", href: "/account/addresses" },
      { label: "Contractor Pricing", href: "/account/contractor-pricing" },
      { label: "Sign In / Create Account", href: "/auth/signin" },
    ],
  },
];

export const metadata = {
  title: "Help & Support — Ujenzi Dhabiti",
  description: "Answers to common questions about ordering house plans, payments, delivery, and our services.",
};

const FAQS_STATIC = [
  {
    iconName: "ShoppingBag",
    question: "How do I order a house plan?",
    answer: "Browse the Shop, choose a plan, select whether you want a digital download or a printed copy, add it to your cart, and check out. You'll receive your plan or a tracking update by email.",
  },
  {
    iconName: "CreditCard",
    question: "What payment methods do you accept?",
    answer: "We accept M-Pesa, card payments (via Flutterwave), and bank transfer. All payments are processed securely, and you'll get a receipt by email once your payment is confirmed.",
  },
  {
    iconName: "Truck",
    question: "How are plans and orders delivered?",
    answer: "Digital plans are delivered instantly via a secure download link after payment. Printed plans are dispatched to your delivery address, and you can follow progress on the order tracking page.",
  },
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

export default async function HelpPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let faqList: any[] = [];
  let phoneNumbers = CONTACT_INFO.phone;
  let emailDir = EMAIL_DIRECTORY;

  try {
    const dbFaqs = await db
      .select()
      .from(faqs)
      .orderBy(asc(faqs.sortOrder));
    if (dbFaqs && dbFaqs.length > 0) {
      faqList = dbFaqs;
    } else {
      faqList = FAQS_STATIC;
    }

    const [settings] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.id, "default"));
    if (settings) {
      if (settings.phoneNumbers && settings.phoneNumbers.length > 0) {
        phoneNumbers = settings.phoneNumbers;
      }
      emailDir = [
        { label: "Customer Service", email: settings.customerServiceEmail },
        { label: "Construction Inquiries", email: settings.constructionEmail },
        { label: "Interior Design Inquiries", email: settings.interiorDesignEmail },
        { label: "Architectural Inquiries", email: settings.architecturalEmail },
      ];
    }
  } catch (err) {
    console.error("Help page dynamic load failed, falling back to static constants:", err);
    faqList = FAQS_STATIC;
  }

  return (
    <>
      <SectionHero
        title="Ujenzi Dhabiti Help Center"
        subtitle="Check out popular help topics, or chat, call or email with us — we're standing by and ready to help."
      />

      <section className="bg-ud-white py-16 md:py-24">
        <div className="max-w-content mx-auto px-6">
          {/* ── Self Service Options ─────────────────────────────────────── */}
          <div className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-ud-dark mb-6">Self Service Options</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {SELF_SERVICE.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 bg-ud-light-gray hover:bg-ud-dark rounded-[4px] p-5 transition-colors"
                >
                  <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 group-hover:bg-white/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    <DynamicIcon name={item.icon} className="w-5 h-5 text-ud-burgundy" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-bold text-ud-dark group-hover:text-white transition-colors leading-snug">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Popular Topics ───────────────────────────────────────────── */}
          <div className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-ud-dark mb-6">Popular Topics</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {POPULAR_TOPICS.map((col) => (
                <div key={col.heading} className="bg-ud-light-gray rounded-[4px] p-6">
                  <h3 className="text-sm font-bold text-ud-dark pb-3 mb-3 border-b border-ud-dark/10">{col.heading}</h3>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-ud-burgundy hover:text-ud-burgundy-hover hover:underline transition-colors">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">Frequently Asked</div>
            <h2 className="text-3xl md:text-4xl font-bold text-ud-dark">How Can We Help?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {faqList.map((faq, idx) => (
              <div key={faq.question || idx} className="bg-ud-light-gray rounded-[4px] p-7 border-t-[3px] border-ud-burgundy">
                <DynamicIcon name={faq.iconName} className="w-7 h-7 text-ud-burgundy mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-ud-dark mb-2">{faq.question}</h3>
                <p className="text-sm text-ud-dark/60 font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* ── How can I contact us? (Grainger-style contact tiles) ─────── */}
          <div className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-ud-dark mb-6">How can I contact Ujenzi Dhabiti?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href={whatsappLink("Hello Ujenzi Dhabiti, I need some help.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-ud-light-gray rounded-[4px] p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-ud-burgundy flex items-center justify-center flex-shrink-0">
                  <LucideIcons.MessageCircle className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ud-dark">Chat on WhatsApp</div>
                  <div className="text-xs text-ud-dark/55 mt-0.5">Mon–Fri 8AM–6PM · Sat 9AM–1PM</div>
                </div>
              </a>
              <a
                href={`tel:${phoneNumbers[0]}`}
                className="flex items-center gap-4 bg-ud-light-gray rounded-[4px] p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-ud-burgundy flex items-center justify-center flex-shrink-0">
                  <LucideIcons.Phone className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ud-dark">Call</div>
                  <div className="text-xs text-ud-dark/55 mt-0.5">{phoneNumbers.join(" · ")}</div>
                </div>
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-4 bg-ud-light-gray rounded-[4px] p-5 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-ud-burgundy flex items-center justify-center flex-shrink-0">
                  <LucideIcons.Mail className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-sm font-bold text-ud-dark">Email</div>
                  <div className="text-xs text-ud-dark/55 mt-0.5">Send us a message</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-ud-dark rounded-[4px] p-10 md:p-12">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold text-ud-white mb-2">Still need help?</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
                  Our team is available Monday to Friday, 8:00 AM – 6:00 PM, and Saturday 9:00 AM – 1:00 PM. Reach us by phone or email and we&apos;ll respond within 24 hours.
                </p>
                <div className="space-y-3">
                  {phoneNumbers.map((p) => (
                    <div key={p} className="flex items-center gap-3">
                      <LucideIcons.Phone size={15} className="text-ud-burgundy flex-shrink-0" />
                      <a href={`tel:${p}`} className="text-sm text-white/70 hover:text-white transition-colors">{p}</a>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="inline-block mt-6 bg-ud-burgundy text-white text-sm font-bold px-5 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                  Contact Us
                </Link>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Email the Right Team</h4>
                <ul className="space-y-3">
                  {emailDir.map((item) => (
                    <li key={item.email} className="flex items-start gap-3">
                      <LucideIcons.Mail size={15} className="text-ud-burgundy flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[11px] uppercase tracking-wider text-white/35">{item.label}</span>
                        <a href={`mailto:${item.email}`} className="text-sm text-white/70 hover:text-white transition-colors break-all">{item.email}</a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
