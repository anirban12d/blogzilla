import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  serial,
  integer,
  jsonb,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const postStatusEnum = pgEnum("post_status", ["DRAFT", "PUBLISHED"]);

export const blogPosts = pgTable("blog_post", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: jsonb("content").notNull(), // <— JSON from Tiptap
  published: boolean("published").default(false),
  status: postStatusEnum("post_status").default("DRAFT").notNull(),
  heroImage: varchar("hero_image", { length: 1024 }),
  readingTime: integer("reading_time"),
  authorId: varchar("author_id")
    .references(() => user.id)
    .notNull(),
  authorName: varchar("author_name", { length: 255 }),
  description: text("description"),
  // store categories inline on the post for simpler fetching
  categories: jsonb("categories"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
