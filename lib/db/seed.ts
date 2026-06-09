import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { users, housePlans, products, deliveryZones, systemSettings, coreValues, whyChooseUs, teamMembers, companyStats, faqs, services, serviceSubsections } from "./schema";
import { HOUSE_PLANS } from "../house-plans";
import { PRODUCTS } from "../products";
import { DELIVERY_ZONES } from "../delivery";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database with expanded CMS data...\n");

  // ─── Admin user ─────────────────────────────────────────────
  console.log("Creating admin user...");
  const adminHash = await bcrypt.hash("Admin@UjenziDhabiti2025!", 12);
  await db
    .insert(users)
    .values({
      id: "usr-admin-001",
      name: "Admin",
      email: "admin@ujenzidhabiti.co.ke",
      passwordHash: adminHash,
      role: "admin",
      emailVerified: true,
    })
    .onConflictDoNothing();

  // ─── CMS: System Settings (Expanded) ────────────────────────
  console.log("Creating/updating system settings...");
  // We delete the settings first to ensure all new fields are populated correctly.
  await db.delete(systemSettings);
  await db
    .insert(systemSettings)
    .values({
      id: "default",
      phoneNumbers: ["+254782999100", "+254739999100"],
      customerServiceEmail: "ujenzi@ujenzidhabiti.co.ke",
      constructionEmail: "build@ujenzidhabiti.co.ke",
      interiorDesignEmail: "design@ujenzidhabiti.co.ke",
      architecturalEmail: "architect@ujenzidhabiti.co.ke",
      address: "B2-06, Manga House, Kiambere Road, Upper Hill, Nairobi, Kenya",
      whatsappNumber: "254782999100",
      motto: "Connecting Africa",
      facebookUrl: "#",
      instagramUrl: "#",
      linkedinUrl: "#",
      twitterUrl: "#",
      tiktokUrl: "#",
      
      // Hero & CTA banner settings
      heroBadge: "Connecting Africa",
      heroTitle: "Building Materials & Construction Services Under One Roof",
      heroSubtitle: "From foundation to finishing — we supply and build.",
      heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop",
      ctaTitle: "Need materials for your project?",
      ctaSubtitle: "Get a tailored quote, or send us your list on WhatsApp — we'll sort the rest.",
      
      // About Page copy
      vision: "To be a leading construction and infrastructure company in Africa, connecting communities through sustainable developments, modern transport networks, and quality housing solutions.",
      mission: "To deliver reliable, high-quality construction and civil works that enhance connectivity, support economic growth, and contribute to the development of safe, functional, and affordable living and working spaces across Africa.",
      storyTitle: "Bridging Gaps in Infrastructure & Housing",
      storyParagraphs: [
        "Ujenzi Dhabiti Limited was established as a subsidiary of Ardhi Safi Limited with a clear and purposeful vision — to bridge critical gaps in infrastructure and housing across the region.",
        "Recognizing the growing need for improved transport networks, the company was founded to contribute to the development of roads and access systems that open up underserved areas. By enhancing connectivity, we aim to facilitate the efficient movement of people and goods, ultimately driving economic growth and regional development.",
        "At the same time, Ujenzi Dhabiti was created to support the mission of Ardhi Safi Limited — ensuring that every individual has access to a place they can call home. Through quality residential construction, we play a vital role in developing modern, secure, and comfortable living spaces.",
        "Together, these goals define who we are: a company committed to building structures that not only stand strong, but also connect people, opportunities, and communities across Africa."
      ],
      commitmentParagraphs: [
        "At Ujenzi Dhabiti Limited, we are committed to delivering excellence in every project we undertake. We strive to build infrastructure and developments that enhance connectivity, improve living standards, and support economic growth.",
        "We are dedicated to maintaining the highest standards of quality, safety, and professionalism while fostering long-term relationships with our clients, partners, and communities.",
        "Through every road we construct and every building we develop, we remain true to our promise — Connecting Africa."
      ]
    });

  // ─── CMS: Core Values ──────────────────────────────────────
  console.log("Creating core values...");
  const valuesData = [
    { id: "val-1", title: "Quality Excellence", description: "We are committed to delivering strong, durable, and high-standard workmanship in every project.", iconName: "Award" },
    { id: "val-2", title: "Integrity", description: "We uphold honesty, transparency, and accountability in all our dealings.", iconName: "Scale" },
    { id: "val-3", title: "Innovation", description: "We embrace modern construction techniques and creative solutions to meet evolving client needs.", iconName: "Lightbulb" },
    { id: "val-4", title: "Customer Focus", description: "We prioritize our clients by understanding their vision and delivering beyond expectations.", iconName: "HeartHandshake" },
    { id: "val-5", title: "Sustainability", description: "We are dedicated to environmentally responsible practices and long-lasting developments.", iconName: "Leaf" },
    { id: "val-6", title: "Collaboration", description: "We work closely with clients, partners, and communities to achieve shared success.", iconName: "Users" },
  ];
  let valIdx = 0;
  for (const val of valuesData) {
    await db
      .insert(coreValues)
      .values({
        id: val.id,
        title: val.title,
        description: val.description,
        iconName: val.iconName,
        sortOrder: valIdx++,
      })
      .onConflictDoNothing();
  }

  // ─── CMS: Why Choose Us ────────────────────────────────────
  console.log("Creating why choose us features...");
  const chooseUsData = [
    { id: "cho-1", title: "Integrated Solutions", description: "From construction and civil works to interior finishes and material supply, we offer end-to-end services under one roof.", iconName: "Layers" },
    { id: "cho-2", title: "Purpose-Driven Approach", description: "Our work goes beyond construction — we build to connect communities and improve livelihoods.", iconName: "Target" },
    { id: "cho-3", title: "Quality & Durability", description: "We prioritize strong, long-lasting structures that deliver value over time.", iconName: "ShieldCheck" },
    { id: "cho-4", title: "Experienced Team", description: "Our skilled professionals bring technical expertise and attention to detail to every project.", iconName: "Wrench" },
    { id: "cho-5", title: "Timely Delivery", description: "We understand the importance of deadlines and strive to complete projects efficiently without compromising quality.", iconName: "Clock" },
    { id: "cho-6", title: "Client-Centered Execution", description: "We tailor our solutions to meet the unique needs of each client and project.", iconName: "UserCheck" },
  ];
  let choIdx = 0;
  for (const cho of chooseUsData) {
    await db
      .insert(whyChooseUs)
      .values({
        id: cho.id,
        title: cho.title,
        description: cho.description,
        iconName: cho.iconName,
        sortOrder: choIdx++,
      })
      .onConflictDoNothing();
  }

  // ─── CMS: Team Members ─────────────────────────────────────
  console.log("Creating team members...");
  const teamData = [
    { id: "team-1", name: "Andrew Wanjala", title: "Chief Executive Officer" },
    { id: "team-2", name: "Grace Mwangi", title: "Director of Engineering" },
    { id: "team-3", name: "James Odhiambo", title: "Director of Operations" },
    { id: "team-4", name: "Fatuma Hassan", title: "Head of Project Management" },
  ];
  let teamIdx = 0;
  for (const t of teamData) {
    await db
      .insert(teamMembers)
      .values({
        id: t.id,
        name: t.name,
        title: t.title,
        image: null,
        sortOrder: teamIdx++,
      })
      .onConflictDoNothing();
  }

  // ─── CMS: Company Stats ────────────────────────────────────
  console.log("Creating stats...");
  const statsData = [
    { id: "stat-1", value: "150+", label: "Projects Completed" },
    { id: "stat-2", value: "8", label: "Countries" },
    { id: "stat-3", value: "15+", label: "Years Experience" },
    { id: "stat-4", value: "500+", label: "Team Members" },
  ];
  let statIdx = 0;
  for (const s of statsData) {
    await db
      .insert(companyStats)
      .values({
        id: s.id,
        value: s.value,
        label: s.label,
        sortOrder: statIdx++,
      })
      .onConflictDoNothing();
  }

  // ─── CMS: FAQs ─────────────────────────────────────────────
  console.log("Creating FAQs...");
  const faqsData = [
    {
      id: "faq-1",
      question: "How do I order a house plan?",
      answer: "Browse the Shop, choose a plan, select whether you want a digital download or a printed copy, add it to your cart, and check out. You'll receive your plan or a tracking update by email.",
      iconName: "ShoppingBag",
    },
    {
      id: "faq-2",
      question: "What payment methods do you accept?",
      answer: "We accept M-Pesa, card payments (via Flutterwave), and bank transfer. All payments are processed securely, and you'll get a receipt by email once your payment is confirmed.",
      iconName: "CreditCard",
    },
    {
      id: "faq-3",
      question: "How are plans and orders delivered?",
      answer: "Digital plans are delivered instantly via a secure download link after payment. Printed plans are dispatched to your delivery address, and you can follow progress on the order tracking page.",
      iconName: "Truck",
    },
  ];
  let faqIdx = 0;
  for (const f of faqsData) {
    await db
      .insert(faqs)
      .values({
        id: f.id,
        question: f.question,
        answer: f.answer,
        iconName: f.iconName,
        sortOrder: faqIdx++,
      })
      .onConflictDoNothing();
  }

  // ─── CMS: Services & Pillars ─────────────────────────────────
  console.log("Creating services catalog categories...");
  await db.delete(services);
  
  const servicesList = [
    // Public Services List (Index Page)
    {
      id: "srv-gypsum",
      slug: "gypsum-ceilings",
      title: "Gypsum Works",
      description: "Professional drywall partitioning and suspended ceiling installations. We deliver smooth, paint-ready surfaces with excellent acoustic and thermal properties, perfect for dividing office spaces or creating modern residential ceilings.",
      iconName: "Layout",
      image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=70&auto=format&fit=crop",
      quoteType: "Interior Design — Office Partitioning",
      includes: [
        "Drywall partitioning & sound-insulation",
        "Suspended ceiling installations (gypsum & board designs)",
        "Decorative cornices, moldings & bulkheads",
        "Metal framing and support structures"
      ],
      materials: [
        "Gypsum Board 12.5mm",
        "Metal Furring Channels & Studs",
        "Skim Coat Wall Putty",
        "Gypsum Screws & Joint Tapes"
      ],
      sortOrder: 0
    },
    {
      id: "srv-paint",
      slug: "paint-finishes",
      title: "Painting & Finishes",
      description: "High-quality interior and exterior paint applications. Our team ensures thorough surface preparation, waterproofing, priming, and uniform coatings that withstand weathering while elevating architectural aesthetics.",
      iconName: "PaintBucket",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=70&auto=format&fit=crop",
      quoteType: "Painting & Finishes",
      includes: [
        "Interior wall and ceiling painting",
        "Exterior weather-proof protective coats",
        "Surface preparation, sanding & wall putty skim coating",
        "Undercoating & primer applications"
      ],
      materials: [
        "Vinyl Silk Emulsion Paint",
        "Wall Primers & Undercoats",
        "Skim Coat Wall Putty",
        "Application Rollers & Brush sets"
      ],
      sortOrder: 1
    },
    {
      id: "srv-tiling",
      slug: "flooring",
      title: "Flooring & Tiling",
      description: "Flawless tiling and floor finishes. We lay durable ceramic, rectified porcelain, or natural stone tiles for high-traffic environments, ensuring perfect level alignment and seamless grouting.",
      iconName: "Grid",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=70&auto=format&fit=crop",
      quoteType: "Flooring Works",
      includes: [
        "Ceramic & porcelain floor tiling",
        "Bathroom & kitchen wall tiling",
        "Floor screeding and leveling preparation",
        "Grout application & joint sealing"
      ],
      materials: [
        "Ceramic Floor Tiles 600x600",
        "Porcelain Tiles 800x800",
        "High-bond Tile Adhesive",
        "Tile Spacers & Grouts"
      ],
      sortOrder: 2
    },
    {
      id: "srv-cabro",
      slug: "cabro-road-works",
      title: "Cabro & Paving Works",
      description: "Premium interlocking paving block works designed for driveways, yards, commercial parking spaces, and estate roads. Built on stable, well-compacted sub-bases to prevent sinking or shifts.",
      iconName: "Hammer",
      image: "https://images.unsplash.com/photo-1597844808175-0d5c4f7b3c8c?w=800&q=70&auto=format&fit=crop",
      quoteType: "Civil Works — Cabro Paving",
      includes: [
        "Interlocking cabro block paving installation",
        "Concrete kerbstone and channel positioning",
        "Hardcore sub-base leveling and heavy compaction",
        "Sand bedding and joint dusting"
      ],
      materials: [
        "Cabro Paving Blocks (60mm / 80mm)",
        "Concrete Kerbstones",
        "Aggregates & Hardcore tippers",
        "Quarry Dust & Paving Sand"
      ],
      sortOrder: 3
    },
    {
      id: "srv-plumb",
      slug: "plumbing",
      title: "Drainage & Plumbing",
      description: "Complete water supply, sanitary sewer, and surface storm water drainage installations. We supply and lay quality pressure-rated piping systems and storage tanks for uninterrupted operations.",
      iconName: "Pipette",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=70&auto=format&fit=crop",
      quoteType: "Plumbing & Drainage",
      includes: [
        "Stormwater channel and drainage pipe layout",
        "Wastewater plumbing & sewage connection systems",
        "Clean water supply network installation",
        "Cold/Hot water storage tank mounting"
      ],
      materials: [
        "PPR Hot/Cold Pipes (20mm / 25mm)",
        "uPVC Soil Pipes (110mm)",
        "Water Storage Tanks (1000L - 10000L)",
        "Brass Valves & Pipe Fittings"
      ],
      sortOrder: 4
    },
    // Service Pillars (Detail Pages)
    {
      id: "srv-building",
      slug: "building-works",
      title: "Building Works",
      description: "Residential and commercial construction, renovation & remodeling, and boundary wall construction across Kenya.",
      iconName: "HardHat",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=70&auto=format&fit=crop",
      quoteType: "Building Works — General",
      includes: ["Residential Construction", "Commercial & Institutional Complexes", "Renovations & Expansion", "Boundary Wall Systems"],
      materials: ["Structural Cement", "Iron Bars & Rebars", "Natural Wall Stones", "Bricks & Timber"],
      sortOrder: 5
    },
    {
      id: "srv-civil",
      slug: "civil-works",
      title: "Civil Works",
      description: "Murram road construction, cabro paving, and road drainage systems across Nairobi and Kenya.",
      iconName: "Wrench",
      image: "https://images.unsplash.com/photo-1597844808175-0d5c4f7b3c8c?w=800&q=70&auto=format&fit=crop",
      quoteType: "Civil Works — General",
      includes: ["Murram Grading & Compacting", "Drainage Systems Installation", "Culverts & Concrete Channels", "Paving Block Driveways"],
      materials: ["Lateritic Murram", "Kerbstones", "Paving Blocks", "Quarry Sand"],
      sortOrder: 6
    },
    {
      id: "srv-interior",
      slug: "interior-design",
      title: "Interior Design",
      description: "Professional drywall partitioning, suspended ceilings, and glass & aluminum office fit-outs.",
      iconName: "Layout",
      image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&q=70&auto=format&fit=crop",
      quoteType: "Interior Design — General",
      includes: ["Drywall Office Partitions", "Tempered Glass Facades", "Bespoke Fittings", "Aesthetic Cornices & Ceiling grids"],
      materials: ["Gypsum Boards", "Aluminum profiles", "Screws", "Sanding putty"],
      sortOrder: 7
    },
    {
      id: "srv-arch",
      slug: "architectural",
      title: "Architectural",
      description: "Architectural design, structural calculations, building drawings, and local council approval sets.",
      iconName: "PencilRuler",
      image: "https://images.unsplash.com/photo-1503387762-592dedb82297?w=800&q=70&auto=format&fit=crop",
      quoteType: "Architectural Design — General",
      includes: ["Architectural floor plans", "Structural calculation reports", "MEP drawings", "Renderings & 3D models"],
      materials: ["Blueprints", "Digital CAD files", "3D Renders"],
      sortOrder: 8
    }
  ];

  for (const s of servicesList) {
    await db.insert(services).values({
      id: s.id,
      slug: s.slug,
      title: s.title,
      description: s.description,
      iconName: s.iconName,
      image: s.image,
      quoteType: s.quoteType,
      includes: s.includes,
      materials: s.materials,
      sortOrder: s.sortOrder,
      published: true
    });
  }

  // ─── CMS: Service Subsections ────────────────────────────────
  console.log("Creating service detail subsections...");
  await db.delete(serviceSubsections);

  const subSectionsList = [
    // Subsections for Building Works
    {
      id: "sub-build-res",
      serviceSlug: "building-works",
      sectionId: "residential",
      title: "Residential Construction & Housing Development",
      body: "At Ujenzi Dhabiti, we design and build high-quality residential properties that combine comfort, durability, and long-term investment value. Whether for homeownership or income generation, our developments are tailored to meet the needs of both local clients and Kenyans in the diaspora seeking reliable, transparent, and professionally managed construction solutions.",
      planType: "Bungalow",
      bullets: ["Bungalows & Multi-level townhouses", "Executive apartments designed for rental yields", "Diaspora-friendly progress tracking reports"],
      sortOrder: 0
    },
    {
      id: "sub-build-com",
      serviceSlug: "building-works",
      sectionId: "commercial",
      title: "Commercial & Institutional Developments",
      body: "At Ujenzi Dhabiti, we design and construct high-performance commercial and institutional properties that support economic growth and community development. Our portfolio spans retail, industrial, corporate, mixed-use, and educational facilities across urban and emerging markets.",
      planType: "Commercial",
      bullets: ["High capacity warehouses & logistics hubs", "Strip malls & neighborhood retail centers", "Mixed-use complexes and educational blocks"],
      sortOrder: 1
    },
    {
      id: "sub-build-ren",
      serviceSlug: "building-works",
      sectionId: "renovation",
      title: "Renovation & Remodeling Services",
      body: "At Ujenzi Dhabiti, we breathe new life into existing spaces through professional renovation and remodeling solutions designed to enhance functionality, aesthetics, and long-term value — whether upgrading a home, modernizing a commercial space, or repositioning a property for better returns.",
      planType: null,
      bullets: ["Residential kitchen and bathroom modernization", "Warehouse and retail center improvements", "Façade structural enhancements"],
      sortOrder: 2
    },
    {
      id: "sub-build-wall",
      serviceSlug: "building-works",
      sectionId: "boundary-walls",
      title: "Boundary Wall Construction",
      body: "At Ujenzi Dhabiti, we design and construct strong, secure, and aesthetically appealing boundary walls that provide protection, privacy, and a clear definition of property ownership. Our solutions combine structural strength with architectural appeal.",
      planType: null,
      bullets: ["Natural stone boundary walls with reinforced columns", "Electric fencing and razor wire integrations", "Automated steel security gates"],
      sortOrder: 3
    },

    // Subsections for Civil Works
    {
      id: "sub-civil-road",
      serviceSlug: "civil-works",
      sectionId: "murram-roads",
      title: "Murram Road Construction",
      body: "At Ujenzi Dhabiti, we specialize in the construction of high-quality murram roads designed to provide durable, cost-effective, and reliable access across residential, commercial, agricultural, and industrial developments.",
      planType: null,
      bullets: ["Standard compacted access roads", "Heavy-duty lateritic subgrades for industrial haulage", "Graded alignment profile camber shaping"],
      sortOrder: 0
    },
    {
      id: "sub-civil-cabro",
      serviceSlug: "civil-works",
      sectionId: "cabro-paving",
      title: "Cabro Paving & Site Surfacing",
      body: "At Ujenzi Dhabiti, we specialize in high-quality cabro paving solutions that combine durability, functionality, and aesthetic appeal. Cabro (concrete block paving) is one of the most preferred surfacing options in Kenya due to its strength, ease of maintenance, and ability to enhance the visual value of any property.",
      planType: null,
      bullets: ["Premium estate access roads", "Highload shipping yards and warehouse depots", "Custom patterned color pathways"],
      sortOrder: 1
    },
    {
      id: "sub-civil-drain",
      serviceSlug: "civil-works",
      sectionId: "road-drainage",
      title: "Road Drainage Systems",
      body: "At Ujenzi Dhabiti, we specialize in the design and construction of road drainage systems in Kenya, ensuring roads remain durable, safe, and functional throughout all weather conditions. Proper drainage is critical in preventing flooding.",
      planType: null,
      bullets: ["Side drains (open channels)", "Culvert piping crossings and box channels", "French subsurface water drainage catchments"],
      sortOrder: 2
    },

    // Subsections for Interior Design
    {
      id: "sub-int-part",
      serviceSlug: "interior-design",
      sectionId: "office-partitioning",
      title: "Office Drywall & Board Partitioning",
      body: "We construct high-quality partitions to optimize workplace layout and noise reduction.",
      planType: null,
      bullets: ["Soundproofing acoustic insulation boards", "Custom modular desk room partitions", "Fast-track dry layouts"],
      sortOrder: 0
    },
    {
      id: "sub-int-glass",
      serviceSlug: "interior-design",
      sectionId: "glass-aluminum",
      title: "Glass & Aluminum Shopfronts & Partitions",
      body: "Modern glass partition designs for offices and premium retail settings.",
      planType: null,
      bullets: ["Tempered safety glass panes", "Heavy gauge anodized aluminum framing", "Aesthetic layout panels"],
      sortOrder: 1
    },
    {
      id: "sub-int-fit",
      serviceSlug: "interior-design",
      sectionId: "fittings",
      title: "Custom Interior Fittings & Ceilings",
      body: "Bespoke carpentry, kitchen cabinetry, and custom drywall suspended ceilings.",
      planType: null,
      bullets: ["High grade laminated panels", "Suspended lighting slots", "Modern designs"],
      sortOrder: 2
    },

    // Subsections for Architectural
    {
      id: "sub-arch-draft",
      serviceSlug: "architectural",
      sectionId: "architectural-design",
      title: "Architectural Drafting & Designing",
      body: "From concept sketch to detailed blue print sets, we design modern structures.",
      planType: "Bungalow",
      bullets: ["Modern residential layouts", "Commercial blocks", "Council approval drawing sets"],
      sortOrder: 0
    },
    {
      id: "sub-arch-struct",
      serviceSlug: "architectural",
      sectionId: "structural-engineering",
      title: "Structural Details & Calculation Sets",
      body: "Reinforced concrete details, foundation calculations, steel frameworks.",
      planType: null,
      bullets: ["Bending schedule drawings", "Safety factors calculations", "Site inspection certifications"],
      sortOrder: 1
    },
    {
      id: "sub-arch-mep",
      serviceSlug: "architectural",
      sectionId: "mep-systems",
      title: "Mechanical, Electrical, & Plumbing Plan Sets",
      body: "Complete service drawings detailing layout of piping, wire conduits, and HVAC channels.",
      planType: null,
      bullets: ["Electrical layout blueprints", "Sanitary schematics", "Optimal HVAC ducting maps"],
      sortOrder: 2
    }
  ];

  for (const sub of subSectionsList) {
    await db.insert(serviceSubsections).values({
      id: sub.id,
      serviceSlug: sub.serviceSlug,
      sectionId: sub.sectionId,
      title: sub.title,
      body: sub.body,
      planType: sub.planType,
      bullets: sub.bullets,
      sortOrder: sub.sortOrder
    });
  }

  // ─── House plans ─────────────────────────────────────────────
  console.log("Creating house plans...");
  for (const p of HOUSE_PLANS) {
    await db
      .insert(housePlans)
      .values({
        id: p.id,
        name: p.name,
        category: p.category,
        planType: p.planType,
        description: p.description,
        priceDigitalKES: p.priceDigitalKES,
        pricePrintKES: p.pricePrintKES,
        image: p.image ?? null,
        bedrooms: p.bedrooms ?? null,
        bathrooms: p.bathrooms ?? null,
        floors: p.floors,
        plinthAreaSqM: p.plinthAreaSqM,
        downloadFile: p.downloadFile ?? null,
        downloadSizeBytes: p.downloadSizeBytes ?? null,
        published: true,
      })
      .onConflictDoNothing();
  }

  // ─── Materials catalogue ─────────────────────────────────────
  console.log("Creating materials...");
  await db.delete(products);
  for (const p of PRODUCTS) {
    await db
      .insert(products)
      .values({
        id: p.id,
        sellerId: null,
        name: p.name,
        category: p.category,
        description: p.description,
        priceKES: p.priceKES,
        unit: p.unit,
        stock: p.inStock ? 100 : 0,
        images: [p.image],
        specs: p.specs ?? {},
        coverageSqmPerUnit: p.coverageSqmPerUnit ?? null,
        brand: p.brand ?? null,
        materialType: p.materialType ?? null,
        isActive: true,
      })
      .onConflictDoNothing();
  }

  // ─── Delivery zones ──────────────────────────────────────────
  console.log("Creating delivery zones...");
  let zi = 0;
  for (const z of DELIVERY_ZONES) {
    await db
      .insert(deliveryZones)
      .values({
        id: `zone-${z.county.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
        county: z.county,
        feeKES: z.feeKES,
        sortOrder: zi++,
        published: true,
      })
      .onConflictDoNothing();
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${PRODUCTS.length} materials`);
  console.log(`   ${HOUSE_PLANS.length} house plans`);
  console.log(`   ${DELIVERY_ZONES.length} delivery zones`);
  console.log(`   ${servicesList.length} service options`);
  console.log(`   ${subSectionsList.length} service subsections`);
  console.log("\n   Admin login: admin@ujenzidhabiti.co.ke / Admin@UjenziDhabiti2025!\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
