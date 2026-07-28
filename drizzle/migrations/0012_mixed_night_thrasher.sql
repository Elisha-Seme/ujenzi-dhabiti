ALTER TABLE "team_members" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "competencies" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "qualifications" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "published" boolean DEFAULT true NOT NULL;