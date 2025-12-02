import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { blogPosts, postStatusEnum } from "../../drizzle/schemas/blog-schema";
import type { Category } from "./category";

export type Post = InferSelectModel<typeof blogPosts>;
export type NewPost = InferInsertModel<typeof blogPosts>;

export type PostStatus = (typeof postStatusEnum.enumValues)[number];

export type PostWithCategories = Post & {
  categories: Category[];
};

export type CreatePostInput = {
  title: string;
  slug: string;
  content: unknown; // JSON from editor
  heroImage?: string | null;
  status?: PostStatus;
  published?: boolean;
  categoryIds?: number[];
};

export type UpdatePostInput = {
  id: number;
  title?: string;
  slug?: string;
  content?: unknown;
  heroImage?: string | null;
  status?: PostStatus;
  published?: boolean;
  categoryIds?: number[];
};
