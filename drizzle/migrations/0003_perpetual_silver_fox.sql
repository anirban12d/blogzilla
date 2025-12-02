ALTER TABLE "blog_post" ADD COLUMN "author_name" varchar(255);--> statement-breakpoint
ALTER TABLE "blog_post" ADD COLUMN "categories" jsonb;