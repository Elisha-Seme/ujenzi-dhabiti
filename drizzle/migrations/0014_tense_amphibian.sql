ALTER TABLE "quotes" ADD COLUMN "contact_name" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "contact_phone" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "subject" text;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "attachments" jsonb DEFAULT '[]'::jsonb NOT NULL;