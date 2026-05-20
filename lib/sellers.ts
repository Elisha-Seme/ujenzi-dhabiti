export interface Seller {
  id: string;
  name: string;
  tagline: string;
  location: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  joinedYear: number;
  totalSales: number;
  logo: string | null;
  description: string;
  categories: string[];
  phone: string;
}

export const SELLERS: Seller[] = [
  {
    id: "sel-001",
    name: "Nairobi Building Supplies",
    tagline: "Your one-stop shop for all structural materials",
    location: "Industrial Area, Nairobi",
    verified: true,
    rating: 4.8,
    reviewCount: 312,
    joinedYear: 2021,
    totalSales: 1840,
    logo: null,
    description:
      "We have supplied construction materials to contractors, developers, and individual builders across Kenya for over 12 years. Competitive pricing, genuine products, and on-time delivery to site.",
    categories: ["Cement & Concrete", "Steel & Rebar"],
    phone: "+254711000001",
  },
  {
    id: "sel-002",
    name: "Eastlands Steel Merchants",
    tagline: "High-yield steel direct from mill",
    location: "Eastlands, Nairobi",
    verified: true,
    rating: 4.6,
    reviewCount: 189,
    joinedYear: 2022,
    totalSales: 920,
    logo: null,
    description:
      "Specialist steel stockist and distributor. We hold mill certificates for every batch and can cut-to-length on site. Serving structural engineers, contractors, and fabricators.",
    categories: ["Steel & Rebar"],
    phone: "+254722000002",
  },
  {
    id: "sel-003",
    name: "AquaFlow Pipes Kenya",
    tagline: "Water infrastructure specialists",
    location: "Athi River, Nairobi",
    verified: true,
    rating: 4.7,
    reviewCount: 143,
    joinedYear: 2020,
    totalSales: 670,
    logo: null,
    description:
      "Importers and distributors of HDPE, uPVC, and ductile iron pipe systems. Full range of fittings, valves, and accessories stocked. Technical support available for system design.",
    categories: ["Pipes & Fittings"],
    phone: "+254733000003",
  },
  {
    id: "sel-004",
    name: "SafeGuard PPE Africa",
    tagline: "Keeping your workforce safe",
    location: "Westlands, Nairobi",
    verified: true,
    rating: 4.9,
    reviewCount: 428,
    joinedYear: 2019,
    totalSales: 3100,
    logo: null,
    description:
      "East Africa's leading PPE supplier. All our products are certified to European and international standards. Bulk orders for contractors and institutions welcome — same-day dispatch on in-stock items.",
    categories: ["Safety Equipment"],
    phone: "+254744000004",
  },
  {
    id: "sel-005",
    name: "Jua Kali Heavy Equipment",
    tagline: "Heavy machinery for serious builders",
    location: "Mombasa Road, Nairobi",
    verified: false,
    rating: 4.2,
    reviewCount: 67,
    joinedYear: 2023,
    totalSales: 290,
    logo: null,
    description:
      "Importers of construction equipment — mixers, compactors, breakers, and vibrators. We offer warranty and after-sales service. New and refurbished units available.",
    categories: ["Heavy Equipment"],
    phone: "+254755000005",
  },
  {
    id: "sel-006",
    name: "ProBuild Tools Ltd",
    tagline: "Professional tools for professional builders",
    location: "Karen, Nairobi",
    verified: true,
    rating: 4.5,
    reviewCount: 211,
    joinedYear: 2021,
    totalSales: 1450,
    logo: null,
    description:
      "Stockists of surveying instruments, scaffolding, power tools, and site accessories. We serve architects, quantity surveyors, and main contractors across East Africa.",
    categories: ["Tools & Accessories"],
    phone: "+254766000006",
  },
];
