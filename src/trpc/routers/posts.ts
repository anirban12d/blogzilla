import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { db } from "@/lib/db/database-pool";
import { blogPosts, postStatusEnum } from "../../../drizzle/schemas/blog-schema";
import { categories, postCategories } from "../../../drizzle/schemas/categories-schema";
import { and, desc, eq, inArray, sql, or, ilike } from "drizzle-orm";

const STATUS = postStatusEnum.enumValues as readonly ["DRAFT", "PUBLISHED"];

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.unknown(),
  heroImage: z.string().url().max(1024).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(STATUS).default("DRAFT"),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
});

const updatePostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  content: z.unknown().optional(),
  heroImage: z.string().url().max(1024).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(STATUS).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
});

export const postsRouter = createTRPCRouter({
  listPublic: publicProcedure
    .input(
      z
        .object({
          categorySlug: z.string().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.status, "PUBLISHED" as any))
        .orderBy(desc(blogPosts.createdAt));
      if (!input?.categorySlug) return rows;
      return rows.filter((p: any) =>
        Array.isArray((p as any).categories)
          ? (p as any).categories.some((c: any) => c.slug === input.categorySlug)
          : false,
      );
    }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      if (!input.query) return [];
      const searchPattern = `%${input.query}%`;
      const rows = await db
        .select()
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.status, "PUBLISHED" as any),
            or(
              ilike(blogPosts.title, searchPattern),
              ilike(blogPosts.description, searchPattern),
              ilike(blogPosts.authorName, searchPattern),
              ilike(blogPosts.slug, searchPattern)
            )
          )
        )
        .limit(10)
        .orderBy(desc(blogPosts.createdAt));
      return rows;
    }),

  listMine: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.authorId, ctx.userId))
      .orderBy(desc(blogPosts.createdAt));
    return rows;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, input.slug));
      return post ?? null;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.id, input.id), eq(blogPosts.authorId, ctx.userId)));
      return post ?? null;
    }),

  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      let categoriesPayload: Array<{ id: number; name: string; slug: string }> = [];
      if (input.categoryIds?.length) {
        const rows = await db
          .select()
          .from(categories)
          .where(inArray(categories.id, input.categoryIds));
        categoriesPayload = rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
      }
      const [post] = await db
        .insert(blogPosts)
        .values({
          title: input.title,
          slug: input.slug,
          content: input.content,
          heroImage: input.heroImage ?? null,
          description: input.description ?? null,
          status: input.status ?? "DRAFT",
          published: input.published ?? false,
          authorId: ctx.userId,
          authorName: ctx.session!.user.name as any,
          categories: categoriesPayload as any,
        })
        .returning();
      return post ?? null;
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, categoryIds, ...rest } = input;

      let categoriesPayload: Array<{ id: number; name: string; slug: string }> | undefined;
      if (Array.isArray(categoryIds)) {
        if (categoryIds.length) {
          const rows = await db
            .select()
            .from(categories)
            .where(inArray(categories.id, categoryIds));
          categoriesPayload = rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
        } else {
          categoriesPayload = [];
        }
      }

      const [updated] = await db
        .update(blogPosts)
        .set({ ...rest, ...(categoriesPayload ? { categories: categoriesPayload as any } : {}) })
        .where(and(eq(blogPosts.id, id), eq(blogPosts.authorId, ctx.userId)))
        .returning();

      return updated ?? null;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const [deleted] = await db
        .delete(blogPosts)
        .where(and(eq(blogPosts.id, input.id), eq(blogPosts.authorId, ctx.userId)))
        .returning();
      return deleted ?? null;
    }),
});


