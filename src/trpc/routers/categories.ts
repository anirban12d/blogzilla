import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { db } from "@/lib/db/database-pool";
import { categories } from "../../../drizzle/schemas/categories-schema";
import { asc, desc, eq } from "drizzle-orm";

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(10_000).nullable().optional(),
});

const updateCategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(10_000).nullable().optional(),
});

export const categoriesRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          order: z.enum(["asc", "desc"]).default("desc"),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const order = input?.order === "asc" ? asc(categories.createdAt) : desc(categories.createdAt);
      const rows = await db.select().from(categories).orderBy(order);
      return rows;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const [row] = await db.select().from(categories).where(eq(categories.id, input.id));
      return row ?? null;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const [row] = await db.select().from(categories).where(eq(categories.slug, input.slug));
      return row ?? null;
    }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      const [row] = await db
        .insert(categories)
        .values({
          name: input.name,
          slug: input.slug,
          description: input.description ?? null,
        })
        .returning();
      return row;
    }),

  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      const [row] = await db.update(categories).set(rest).where(eq(categories.id, id)).returning();
      return row ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const [row] = await db.delete(categories).where(eq(categories.id, input.id)).returning();
      return row ?? null;
    }),
});


