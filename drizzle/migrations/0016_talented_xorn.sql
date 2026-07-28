CREATE TABLE "service_material_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"service_slug" text NOT NULL,
	"subsection_id" text,
	"title" text NOT NULL,
	"description" text,
	"product_ids" text[] DEFAULT '{}' NOT NULL,
	"quantity_guidance" text,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_material_packages" ADD CONSTRAINT "service_material_packages_service_slug_services_slug_fk" FOREIGN KEY ("service_slug") REFERENCES "public"."services"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_material_packages" ADD CONSTRAINT "service_material_packages_subsection_id_service_subsections_id_fk" FOREIGN KEY ("subsection_id") REFERENCES "public"."service_subsections"("id") ON DELETE cascade ON UPDATE no action;