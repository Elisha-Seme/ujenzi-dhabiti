CREATE TABLE "blog_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"cover_image" text,
	"category" text DEFAULT 'Resources' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"author" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "company_credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"detail" text NOT NULL,
	"credential_number" text,
	"issued_year" integer,
	"expires_year" integer,
	"image" text,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_customization_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"request" text NOT NULL,
	"status" "quote_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"quote" text NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text,
	"company" text,
	"rating" integer,
	"image" text,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "country" text DEFAULT 'Kenya' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "year" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "timeline" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "budget_range" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_name" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_name_approved" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "competences" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "plan_customization_requests" ADD CONSTRAINT "plan_customization_requests_plan_id_house_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."house_plans"("id") ON DELETE set null ON UPDATE no action;