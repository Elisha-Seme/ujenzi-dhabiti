ALTER TABLE "projects" ADD COLUMN "country" text DEFAULT 'Kenya' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_name" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "start_date" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "completion_date" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "budget_min_kes" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "budget_max_kes" integer;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "outcomes" text;