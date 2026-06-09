import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["buyer", "seller", "admin"]);

export const sellerStatusEnum = pgEnum("seller_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "dispatched",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "mpesa",
  "flutterwave",
  "bank",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "initiated",
  "success",
  "failed",
  "expired",
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "pending",
  "responded",
  "declined",
]);


// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("buyer"),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Magic link tokens (for passwordless login) ───────────────────────────────

export const verificationTokens = pgTable("verification_tokens", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Seller profiles ──────────────────────────────────────────────────────────

export const sellers = pgTable("sellers", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  location: text("location"),
  phone: text("phone"),
  kraPin: text("kra_pin"),
  businessCert: text("business_cert"), // Cloudinary URL
  categories: text("categories").array().notNull().default([]),
  status: sellerStatusEnum("status").notNull().default("pending"),
  verified: boolean("verified").notNull().default(false),
  rating: integer("rating").notNull().default(0), // stored as x10 e.g. 48 = 4.8
  reviewCount: integer("review_count").notNull().default(0),
  totalSales: integer("total_sales").notNull().default(0),
  joinedYear: integer("joined_year").notNull(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  // Nullable: single-vendor catalogue (products are Ujenzi Dhabiti's own).
  // Legacy rows may still carry a sellerId; new admin-created ones are null.
  sellerId: text("seller_id").references(() => sellers.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  priceKES: integer("price_kes").notNull(),
  unit: text("unit").notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images").array().notNull().default([]),
  specs: jsonb("specs").$type<Record<string, string>>(),
  // m² covered by one unit — powers the material calculator (null = not area-based)
  coverageSqmPerUnit: real("coverage_sqm_per_unit"),
  brand: text("brand"),
  materialType: text("material_type"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  buyerId: text("buyer_id").references(() => users.id, { onDelete: "set null" }),
  // Guest checkout fields (no account required)
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  // Delivery
  deliveryAddress: text("delivery_address").notNull(),
  deliveryCity: text("delivery_city").notNull(),
  deliveryCounty: text("delivery_county"),
  // Financials
  subtotalKES: integer("subtotal_kes").notNull(),
  platformFeeKES: integer("platform_fee_kes").notNull(),
  totalKES: integer("total_kes").notNull(),
  // Deposit orders: amount paid up front (null = paid in full). Balance = total - deposit.
  depositKES: integer("deposit_kes"),
  // Status
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  // Tracking
  trackingNumber: text("tracking_number"),
  dispatchedAt: timestamp("dispatched_at"),
  deliveredAt: timestamp("delivered_at"),
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Order items ──────────────────────────────────────────────────────────────

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  sellerId: text("seller_id").references(() => sellers.id, {
    onDelete: "set null",
  }),
  // Snapshot at time of purchase (so history stays accurate even if product changes)
  productName: text("product_name").notNull(),
  productImage: text("product_image"),
  sellerName: text("seller_name").notNull(),
  priceKES: integer("price_kes").notNull(),
  quantity: integer("quantity").notNull(),
  // Per-item dispatch (one seller may dispatch before another)
  dispatched: boolean("dispatched").notNull().default(false),
  dispatchedAt: timestamp("dispatched_at"),
  trackingNumber: text("tracking_number"),
});

// ─── Payments ─────────────────────────────────────────────────────────────────

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  provider: paymentMethodEnum("provider").notNull(),
  externalRef: text("external_ref"), // M-Pesa CheckoutRequestID / Flutterwave tx_ref
  status: paymentStatusEnum("status").notNull().default("initiated"),
  amountKES: integer("amount_kes").notNull(),
  metadata: jsonb("metadata"), // raw webhook payload for auditing
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Account: Quotes ──────────────────────────────────────────────────────────

export const quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  projectType: text("project_type").notNull(),
  description: text("description").notNull(),
  status: quoteStatusEnum("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  respondedAt: timestamp("responded_at"),
});

// ─── Account: Saved Carts ──────────────────────────────────────────────────────

export const savedCarts = pgTable("saved_carts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  items: jsonb("items").$type<{
    productId: string;
    kind: "material" | "plan";
    name: string;
    unit: string;
    priceKES: number;
    image: string;
    sellerId: string;
    sellerName: string;
    quantity: number;
  }[]>().notNull(),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

// ─── Account: Addresses ───────────────────────────────────────────────────────

export const addresses = pgTable("addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  label: text("label").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  county: text("county"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── CMS: Projects ("What We've Built") ──────────────────────────────────────

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location"),
  category: text("category").notNull().default("Building"), // Building | Civil | Interior | Architectural
  propertyType: text("property_type"), // Residential | Commercial | Institutional
  description: text("description").notNull(),
  scope: text("scope"),
  coverImage: text("cover_image"),
  beforeImage: text("before_image"),
  afterImage: text("after_image"),
  images: text("images").array().notNull().default([]),
  materialsUsed: text("materials_used").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── CMS: Architectural services ─────────────────────────────────────────────

export const architecturalServices = pgTable("architectural_services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  body: text("body").notNull(),
  image: text("image"),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Newsletter subscribers ───────────────────────────────────────────────────

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── CMS: Delivery rates (admin-managed; static module is the seed/fallback) ──

export const deliveryZones = pgTable("delivery_zones", {
  id: text("id").primaryKey(),
  county: text("county").notNull(),
  region: text("region"), // optional grouping e.g. "Nairobi Metro" / "Coast" / "Upcountry"
  feeKES: integer("fee_kes").notNull(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── CMS: House plans (admin-managed catalogue; static module is the seed/fallback) ──

export const housePlans = pgTable("house_plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Bungalow | Townhouse | Maisonette | Villa | Apartment | Commercial
  planType: text("plan_type").notNull(),
  description: text("description").notNull(),
  priceDigitalKES: integer("price_digital_kes").notNull(),
  pricePrintKES: integer("price_print_kes").notNull(),
  image: text("image"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  floors: integer("floors").notNull().default(1),
  plinthAreaSqM: integer("plinth_area_sqm").notNull().default(0),
  downloadFile: text("download_file"),
  downloadSizeBytes: integer("download_size_bytes"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ArchitecturalService = typeof architecturalServices.$inferSelect;
export type NewArchitecturalService = typeof architecturalServices.$inferInsert;
export type HousePlanRow = typeof housePlans.$inferSelect;
export type NewHousePlanRow = typeof housePlans.$inferInsert;
export type DeliveryZoneRow = typeof deliveryZones.$inferSelect;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Seller = typeof sellers.$inferSelect;
export type NewSeller = typeof sellers.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type SavedCart = typeof savedCarts.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;


// ─── CMS: System Settings ───────────────────────────────────────────────────

export const systemSettings = pgTable("system_settings", {
  id: text("id").primaryKey(), // always 'default'
  phoneNumbers: text("phone_numbers").array().notNull().default([]),
  customerServiceEmail: text("customer_service_email").notNull(),
  constructionEmail: text("construction_email").notNull(),
  interiorDesignEmail: text("interior_design_email").notNull(),
  architecturalEmail: text("architectural_email").notNull(),
  address: text("address").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  motto: text("motto").notNull(),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  tiktokUrl: text("tiktok_url"),
  
  // Hero & CTA text settings
  heroBadge: text("hero_badge").notNull().default("Connecting Africa"),
  heroTitle: text("hero_title").notNull().default("Building Materials & Construction Services Under One Roof"),
  heroSubtitle: text("hero_subtitle").notNull().default("From foundation to finishing — we supply and build."),
  heroImage: text("hero_image").notNull().default("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop"),
  ctaTitle: text("cta_title").notNull().default("Need materials for your project?"),
  ctaSubtitle: text("cta_subtitle").notNull().default("Get a tailored quote, or send us your list on WhatsApp — we'll sort the rest."),
  
  // About Page texts
  vision: text("vision").notNull().default("To be a leading construction and infrastructure company in Africa, connecting communities through sustainable developments, modern transport networks, and quality housing solutions."),
  mission: text("mission").notNull().default("To deliver reliable, high-quality construction and civil works that enhance connectivity, support economic growth, and contribute to the development of safe, functional, and affordable living and working spaces across Africa."),
  storyTitle: text("story_title").notNull().default("Bridging Gaps in Infrastructure & Housing"),
  storyParagraphs: text("story_paragraphs").array().notNull().default([]),
  commitmentParagraphs: text("commitment_paragraphs").array().notNull().default([]),
  
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── CMS: Core Values ────────────────────────────────────────────────────────

export const coreValues = pgTable("core_values", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── CMS: Why Choose Us ──────────────────────────────────────────────────────

export const whyChooseUs = pgTable("why_choose_us", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── CMS: Team Members ───────────────────────────────────────────────────────

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── CMS: Company Stats ──────────────────────────────────────────────────────

export const companyStats = pgTable("company_stats", {
  id: text("id").primaryKey(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── CMS: FAQs ───────────────────────────────────────────────────────────────

export const faqs = pgTable("faqs", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  iconName: text("icon_name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── CMS: Services ──────────────────────────────────────────────────────────

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Layout"),
  image: text("image").notNull(),
  quoteType: text("quote_type").notNull(),
  includes: text("includes").array().notNull().default([]),
  materials: text("materials").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── CMS: Service Subsections ───────────────────────────────────────────────

export const serviceSubsections = pgTable("service_subsections", {
  id: text("id").primaryKey(),
  serviceSlug: text("service_slug")
    .notNull()
    .references(() => services.slug, { onDelete: "cascade" }),
  sectionId: text("section_id").notNull(), // e.g. "residential", "commercial", etc.
  title: text("title").notNull(),
  body: text("body").notNull(),
  planType: text("plan_type"), // e.g. "Bungalow", etc.
  bullets: text("bullets").array().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── CMS Types ───────────────────────────────────────────────────────────────

export type SystemSettings = typeof systemSettings.$inferSelect;
export type NewSystemSettings = typeof systemSettings.$inferInsert;
export type CoreValue = typeof coreValues.$inferSelect;
export type NewCoreValue = typeof coreValues.$inferInsert;
export type WhyChooseUsRow = typeof whyChooseUs.$inferSelect;
export type NewWhyChooseUsRow = typeof whyChooseUs.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type CompanyStatRow = typeof companyStats.$inferSelect;
export type NewCompanyStatRow = typeof companyStats.$inferInsert;
export type FaqRow = typeof faqs.$inferSelect;
export type NewFaqRow = typeof faqs.$inferInsert;
export type ServiceRow = typeof services.$inferSelect;
export type NewServiceRow = typeof services.$inferInsert;
export type ServiceSubsectionRow = typeof serviceSubsections.$inferSelect;
export type NewServiceSubsectionRow = typeof serviceSubsections.$inferInsert;
