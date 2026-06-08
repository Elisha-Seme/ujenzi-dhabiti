import {
  pgTable,
  text,
  integer,
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
  sellerId: text("seller_id")
    .notNull()
    .references(() => sellers.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  priceKES: integer("price_kes").notNull(),
  unit: text("unit").notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images").array().notNull().default([]),
  specs: jsonb("specs").$type<Record<string, string>>(),
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
