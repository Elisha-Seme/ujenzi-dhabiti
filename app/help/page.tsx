import Link from "next/link";
import * as LucideIcons from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import { CONTACT_INFO, EMAIL_DIRECTORY } from "@/lib/constants";
import { db } from "@/lib/db";
import { faqs, systemSettings } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

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
        title="Help & Support"
        subtitle="Answers to common questions, plus direct ways to reach our team."
      />

      <section className="bg-ud-white py-20 md:py-28">
        <div className="max-w-content mx-auto px-6">
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
