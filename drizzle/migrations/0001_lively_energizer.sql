CREATE TABLE "architectural_services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"body" text NOT NULL,
	"image" text,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "house_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"plan_type" text NOT NULL,
	"description" text NOT NULL,
	"price_digital_kes" integer NOT NULL,
	"price_print_kes" integer NOT NULL,
	"image" text,
	"bedrooms" integer,
	"bathrooms" integer,
	"floors" integer DEFAULT 1 NOT NULL,
	"plinth_area_sqm" integer DEFAULT 0 NOT NULL,
	"download_file" text,
	"download_size_bytes" integer,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"location" text,
	"category" text DEFAULT 'Building' NOT NULL,
	"property_type" text,
	"description" text NOT NULL,
	"scope" text,
	"cover_image" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"materials_used" text[] DEFAULT '{}' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
