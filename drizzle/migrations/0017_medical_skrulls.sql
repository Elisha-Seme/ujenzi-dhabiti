CREATE TABLE "estimator_rates" (
	"id" text PRIMARY KEY NOT NULL,
	"building_type" text NOT NULL,
	"finish_level" text NOT NULL,
	"rate_per_sqm" integer NOT NULL,
	"labour_percent" integer DEFAULT 30 NOT NULL,
	"wastage_percent" integer DEFAULT 5 NOT NULL,
	"location_factor" integer DEFAULT 100 NOT NULL,
	"notes" text,
	"published" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_articles" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"body" text NOT NULL,
	"cover_image" text,
	"author" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "resource_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trust_items" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"body" text,
	"image" text,
	"link_url" text,
	"permission_confirmed" boolean DEFAULT false NOT NULL,
	"expires_at" text,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
