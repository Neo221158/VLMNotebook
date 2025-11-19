CREATE TABLE "rabies_authorities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" text NOT NULL,
	"region" text,
	"veterinarian_name" text NOT NULL,
	"reporting_software" text NOT NULL,
	"contact_email" text NOT NULL,
	"phone_number" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "rabies_authorities_city_idx" ON "rabies_authorities" USING btree ("city");--> statement-breakpoint
CREATE INDEX "rabies_authorities_region_idx" ON "rabies_authorities" USING btree ("region");