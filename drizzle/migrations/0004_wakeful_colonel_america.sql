CREATE TABLE "delivery_zones" (
	"id" text PRIMARY KEY NOT NULL,
	"county" text NOT NULL,
	"region" text,
	"fee_kes" integer NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
