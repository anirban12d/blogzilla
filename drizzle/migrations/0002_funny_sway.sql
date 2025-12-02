CREATE TYPE "public"."post_status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
ALTER TABLE "blog_post" ADD COLUMN "post_status" "post_status" DEFAULT 'DRAFT' NOT NULL;