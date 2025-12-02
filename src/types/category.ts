import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { categories } from "../../drizzle/schemas/categories-schema";

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string | null;
};

export type UpdateCategoryInput = {
  id: number;
  name?: string;
  slug?: string;
  description?: string | null;
};
