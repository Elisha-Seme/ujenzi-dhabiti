CREATE TABLE "service_subsections" (
	"id" text PRIMARY KEY NOT NULL,
	"service_slug" text NOT NULL,
	"section_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"plan_type" text,
	"bullets" text[] DEFAULT '{}' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon_name" text DEFAULT 'Layout' NOT NULL,
	"image" text NOT NULL,
	"quote_type" text NOT NULL,
	"includes" text[] DEFAULT '{}' NOT NULL,
	"materials" text[] DEFAULT '{}' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "hero_badge" text DEFAULT 'Connecting Africa' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "hero_title" text DEFAULT 'Building Materials & Construction Services Under One Roof' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "hero_subtitle" text DEFAULT 'From foundation to finishing — we supply and build.' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "hero_image" text DEFAULT 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "cta_title" text DEFAULT 'Need materials for your project?' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "cta_subtitle" text DEFAULT 'Get a tailored quote, or send us your list on WhatsApp — we''ll sort the rest.' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "vision" text DEFAULT 'To be a leading construction and infrastructure company in Africa, connecting communities through sustainable developments, modern transport networks, and quality housing solutions.' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "mission" text DEFAULT 'To deliver reliable, high-quality construction and civil works that enhance connectivity, support economic growth, and contribute to the development of safe, functional, and affordable living and working spaces across Africa.' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "story_title" text DEFAULT 'Bridging Gaps in Infrastructure & Housing' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "story_paragraphs" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "commitment_paragraphs" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "service_subsections" ADD CONSTRAINT "service_subsections_service_slug_services_slug_fk" FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") ON DELETE cascade ON UPDATE no action;