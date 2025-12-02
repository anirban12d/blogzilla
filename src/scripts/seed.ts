import "dotenv/config";
import { db } from "@/lib/db/database-pool";
import { blogPosts } from "../../drizzle/schemas";
import { categories, postCategories } from "../../drizzle/schemas";
import { user } from "../../drizzle/schemas";
import { eq } from "drizzle-orm";
import { defaultEditorContent } from "@/lib/editor/default-content";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureSeedUser() {
  const id = "seed_user";
  const email = "seed@example.com";
  const name = "Seed User";
  const existing = await db.query.user
    .findFirst({ where: eq(user.id, id) })
    .catch(() => null);
  if (existing) return existing.id;
  await db.insert(user).values({ id, email, name });
  return id;
}

async function ensureCategories() {
  const base = [
    { name: "Design", slug: "design" },
    { name: "Research", slug: "research" },
    { name: "Software", slug: "software" },
  ];
  for (const c of base) {
    const found = await db.query.categories
      .findFirst({ where: eq(categories.slug, c.slug) })
      .catch(() => null);
    if (!found) await db.insert(categories).values({ ...c, description: null });
  }
  const rows = await db.select().from(categories);
  return rows;
}

async function createPosts(authorId: string, count: number) {
  const cats = await ensureCategories();
  const sampleTitle = "How collaboration makes us better designers";
  const baseSlug = slugify(sampleTitle);

  for (let i = 1; i <= count; i++) {
    const slug = i === 1 ? baseSlug : `${baseSlug}-${i}`;
    const shuffled = [...cats].sort(() => Math.random() - 0.5).slice(0, 2);
    const [created] = await db
      .insert(blogPosts)
      .values({
        title: sampleTitle,
        slug,
        content: defaultEditorContent as unknown as object,
        heroImage:
          "https://tltj4g458c.ufs.sh/f/R6miyUBQpeXCiopJfAZUEsL5pfbZ8Chj64K7qRP9WxcBz0rF",
        description:
          "Collaboration can make our teams stronger, and our individual designs better.",
        status: "PUBLISHED" as any,
        published: true,
        authorId,
        authorName: "Seed User",
        readingTime: 3,
        categories: shuffled.map((c) => ({ id: c.id, name: c.name, slug: c.slug })) as any,
      })
      .onConflictDoNothing()
      .returning();

    if (!created) continue;
  }
}

async function main() {
  const countArg = process.argv.find((a) => a.startsWith("--count="));
  const count = countArg
    ? Number(countArg.split("=")[1])
    : Number(process.env.SEED_COUNT ?? 24);
  const authorId = await ensureSeedUser();
  await ensureCategories();
  await createPosts(authorId, Number.isFinite(count) && count > 0 ? count : 24);
  // eslint-disable-next-line no-console
  console.log("Seed completed");
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
