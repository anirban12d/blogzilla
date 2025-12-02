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
} from "drizzle-orm/pg-core";
import { blogPosts } from "./blog-schema";

export const categories = pgTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postCategories = pgTable(
  "post_category",
  {
    postId: integer("post_id")
      .references(() => blogPosts.id)
      .notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  }),
);
