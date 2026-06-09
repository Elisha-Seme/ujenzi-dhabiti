// Order matches the website wireframe. The logo links Home (filtered out of the
// desktop bar); Help lives in the footer.
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Services", href: "/services" },
  { label: "What We've Built", href: "/what-we-built" },
  { label: "Request a Quote", href: "/request-a-quote" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT_INFO = {
  phone: ["+254782999100", "+254739999100"],
  // Four specialized inboxes — route enquiries by the area they concern.
  emails: {
    customerService: "ujenzi@ujenzidhabiti.co.ke",
    construction: "build@ujenzidhabiti.co.ke",
    interiorDesign: "design@ujenzidhabiti.co.ke",
    architectural: "architect@ujenzidhabiti.co.ke",
  },
  // Primary / general inbox (used for plain mailto links and form fallbacks)
  email: "ujenzi@ujenzidhabiti.co.ke",
  address: "B2-06, Manga House, Kiambere Road, Upper Hill, Nairobi, Kenya",
  website: "www.ujenzidhabiti.co.ke",
};

// ─── Deposit policy ──────────────────────────────────────────────
// Large orders may pay a part-deposit now; the balance is collected on delivery.
export const DEPOSIT_PERCENT = 50;
export const DEPOSIT_MIN_ORDER_KES = 50000;

/** Deposit payable now for an order total, or null if the order doesn't qualify. */
export function depositFor(totalKES: number): number | null {
  if (totalKES < DEPOSIT_MIN_ORDER_KES) return null;
  return Math.round((totalKES * DEPOSIT_PERCENT) / 100);
}

// WhatsApp business line (digits only, no "+"). Defaults to the primary phone.
// TODO(client): confirm the dedicated WhatsApp number if different from the main line.
export const WHATSAPP_NUMBER = "254782999100";

/** Build a wa.me deep link with an optional pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Labelled email directory for the footer / contact page.
export const EMAIL_DIRECTORY = [
  { label: "Customer Service", email: CONTACT_INFO.emails.customerService },
  { label: "Construction Inquiries", email: CONTACT_INFO.emails.construction },
  { label: "Interior Design Inquiries", email: CONTACT_INFO.emails.interiorDesign },
  { label: "Architectural Inquiries", email: CONTACT_INFO.emails.architectural },
];

// Social profiles — hrefs are placeholders until the real profile URLs are supplied.
export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Twitter", href: "#", icon: "twitter" },
  { label: "TikTok", href: "#", icon: "tiktok" },
] as const;

// Top-level service pillars. Architectural content is still pending from the brief.
export const SERVICE_PILLARS = [
  {
    label: "Building Works",
    href: "/services/building-works",
    blurb: "Residential and commercial construction, renovation, and boundary walls.",
  },
  {
    label: "Civil Works",
    href: "/services/civil-works",
    blurb: "Murram roads, cabro paving, and road drainage systems.",
  },
  {
    label: "Interior Design",
    href: "/services/interior-design",
    blurb: "Office partitioning and glass & aluminum works.",
  },
  {
    label: "Architectural",
    href: "/services/architectural",
    blurb: "Architectural design and consultancy.",
  },
];

export const PROJECTS = [
  {
    id: 1,
    name: "Nairobi Eastern Bypass Expansion",
    location: "Nairobi, Kenya",
    category: "Roads",
    description:
      "Widening and rehabilitation of 12km of the Eastern Bypass to ease traffic congestion and improve freight movement.",
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Mombasa Port Access Road",
    location: "Mombasa, Kenya",
    category: "Roads",
    description:
      "Construction of a dedicated access road to Mombasa Port, reducing truck congestion and improving port efficiency.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Kigali Commercial Tower",
    location: "Kigali, Rwanda",
    category: "Buildings",
    description:
      "A 12-storey commercial and office complex in Kigali's CBD, delivered on time for a major real estate developer.",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Rift Valley Water Supply Scheme",
    location: "Nakuru, Kenya",
    category: "Water",
    description:
      "Installing 80km of water pipelines and storage tanks serving 40,000 residents in peri-urban Nakuru.",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Dar es Salaam Freight Terminal",
    location: "Dar es Salaam, Tanzania",
    category: "Transport",
    description:
      "Development of a logistics and heavy transport hub servicing East Africa's inland freight network.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Kampala Ring Road Rehabilitation",
    location: "Kampala, Uganda",
    category: "Roads",
    description:
      "Comprehensive rehabilitation of 18km of Kampala's ring road with modern drainage and pedestrian infrastructure.",
    image:
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=600&q=80&auto=format&fit=crop",
  },
];

export const STATS = [
  { value: "150+", label: "Projects Completed" },
  { value: "8", label: "Countries" },
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Team Members" },
];

export const TEAM = [
  {
    name: "Andrew Wanjala",
    title: "Chief Executive Officer",
    image: null,
  },
  {
    name: "Grace Mwangi",
    title: "Director of Engineering",
    image: null,
  },
  {
    name: "James Odhiambo",
    title: "Director of Operations",
    image: null,
  },
  {
    name: "Fatuma Hassan",
    title: "Head of Project Management",
    image: null,
  },
];
