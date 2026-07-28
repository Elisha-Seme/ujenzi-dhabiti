ALTER TABLE "quotes" ADD COLUMN "request_kind" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "source_plan_id" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "source_plan_name" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "structured_data" jsonb;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "attachment_metadata" jsonb;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "consent_to_contact" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "notification_status" text DEFAULT 'pending' NOT NULL;