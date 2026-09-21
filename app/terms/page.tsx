import Link from "next/link";
import SectionHero from "@/components/ui/SectionHero";

export const metadata = {
  title: "Terms of Service — Ujenzi Dhabiti",
  description: "Terms for using the Ujenzi Dhabiti website, shop, and enquiry services.",
};

const sections = [
  ["Using this website", "You may use this website to browse Ujenzi Dhabiti services and products, request a quote, create an account, and place orders for yourself or an organisation you represent. Do not misuse the site, interfere with its operation, or attempt to access another person's account."],
  ["Accounts", "Keep your account details accurate and your password confidential. You are responsible for activity carried out through your account. Contact us promptly if you suspect unauthorised access."],
  ["Products, quotes, and orders", "Product descriptions, availability, delivery estimates, and prices are shown in good faith and may change. A quote is an estimate until confirmed by Ujenzi Dhabiti. An order is accepted when we confirm it and may be subject to stock, delivery, and payment checks."],
  ["Payments and delivery", "Available payment methods are shown at checkout. Delivery charges and timing depend on the destination, item, and confirmed order details. Digital plan downloads are provided only after the related payment is confirmed."],
  ["Enquiries and uploaded material", "Only upload material that you own or are authorised to share. Do not upload unlawful, harmful, or confidential information that Ujenzi Dhabiti is not authorised to receive."],
  ["Contact", "For questions about these terms, contact ujenzi@ujenzidhabiti.co.ke or use the Contact page."],
];

export default function TermsPage() {
  return (
    <>
      <SectionHero title="Terms of Service" subtitle="The basic terms for using Ujenzi Dhabiti online." />
      <section className="bg-ud-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-ud-dark/55 mb-8">Last updated: 21 September 2026</p>
          <div className="space-y-8">
            {sections.map(([heading, body]) => (
              <section key={heading}>
                <h2 className="text-lg font-bold text-ud-dark mb-2">{heading}</h2>
                <p className="text-sm text-ud-dark/70 leading-relaxed">{body}</p>
              </section>
            ))}
          </div>
          <p className="text-xs text-ud-dark/45 border-t border-ud-dark/10 mt-10 pt-6">
            These website terms should be reviewed against the company&apos;s final legal, payment, delivery, and privacy policies before publication.
          </p>
          <Link href="/contact" className="inline-block mt-6 text-sm font-semibold text-ud-burgundy hover:underline">
            Contact Ujenzi Dhabiti →
          </Link>
        </div>
      </section>
    </>
  );
}
