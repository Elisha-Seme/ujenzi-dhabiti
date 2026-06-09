ALTER TABLE "products" DROP CONSTRAINT "products_seller_id_sellers_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "seller_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE set null ON UPDATE no action;