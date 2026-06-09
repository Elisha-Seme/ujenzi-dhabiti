CREATE TABLE "company_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_values" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon_name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"icon_name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"phone_numbers" text[] DEFAULT '{}' NOT NULL,
	"customer_service_email" text NOT NULL,
	"construction_email" text NOT NULL,
	"interior_design_email" text NOT NULL,
	"architectural_email" text NOT NULL,
	"address" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"motto" text NOT NULL,
	"facebook_url" text,
	"instagram_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"tiktok_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"image" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "why_choose_us" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon_name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
