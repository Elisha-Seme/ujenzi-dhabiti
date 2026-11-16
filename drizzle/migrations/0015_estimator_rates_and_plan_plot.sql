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
ALTER TABLE "house_plans" ADD COLUMN "plot_width_m" integer;--> statement-breakpoint
ALTER TABLE "house_plans" ADD COLUMN "plot_depth_m" integer;--> statement-breakpoint
ALTER TABLE "house_plans" ADD COLUMN "architectural_style" text;