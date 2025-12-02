"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/stores/editor";
import { toast } from "sonner";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useMemo } from "react";
import { useTRPC } from "@/trpc/trpc-provider";


function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PublishDrawer() {
  const trpc = useTRPC();
  const utils = trpc.useUtils();
  const trpcClient = useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [
          httpBatchLink({
            url: "/api/trpc",
          }),
        ],
      }),
    [],
  );
  const { postId, title, slug, setSlug, categoryIds, setCategoryIds, heroImage, description } =
    useEditorStore();
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<import("@/types").Category[]>(
    [],
  );
  const [submitting, setSubmitting] = useState(false);
  const selectedCategoryIds = new Set(categoryIds);

  async function refreshCategories() {
    const rows = await trpcClient.categories.list.query({ order: "asc" });
    setCategories((rows as any) ?? []);
  }

  async function generateUniqueSlug() {
    if (!title) return;
    const base = slugify(title);
    let candidate = base;
    let n = 1;
    // check for collisions with imperative utils
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const exists = await trpcClient.posts.getBySlug
        .query({ slug: candidate })
        .catch(() => null);
      if (!exists) {
        setSlug(candidate);
        return;
      }
      n += 1;
      candidate = `${base}-${n}`;
      if (n > 50) {
        toast.error("Could not generate a unique slug");
        return;
      }
    }
  }

  async function handleAddCategory() {
    const name = newCategory.trim();
    if (!name) return;
    const slug = slugify(name);
    try {
      const created = (await trpcClient.categories.create.mutate({
        name,
        slug,
      })) as any;
      setCategoryIds([...categoryIds, created.id]);
      setNewCategory("");
      await refreshCategories();
      toast.success("Category created");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create category");
    }
  }

  async function submit(status: "PUBLISHED" | "DRAFT") {
    if (!title) {
      toast.error("Title is required");
      return;
    }
    const contentStr =
      typeof window !== "undefined"
        ? window.localStorage.getItem("novel-content")
        : null;
    if (!contentStr) {
      toast.error("No editor content to publish");
      return;
    }
    const content = JSON.parse(contentStr);
    if (!slug) {
      await generateUniqueSlug();
    }
    try {
      setSubmitting(true);
      if (postId) {
        await trpcClient.posts.update.mutate({
          id: postId,
          title,
          slug: slug || slugify(title),
          content,
          heroImage: heroImage ?? undefined,
          status,
          published: status === "PUBLISHED",
          categoryIds,
          description,
        });
      } else {
        await trpcClient.posts.create.mutate({
          title,
          slug: slug || slugify(title),
          content,
          heroImage: heroImage ?? undefined,
          status,
          published: status === "PUBLISHED",
          categoryIds,
          description,
        });
      }

      // Invalidate relevant post lists so UI reflects latest changes
      await Promise.all([
        utils.posts.listMine.invalidate(),
        utils.posts.listPublic.invalidate(),
      ]);
      toast.success(status === "PUBLISHED" ? "Post published" : "Draft saved");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Publish</Button>
      </DrawerTrigger>
      <DrawerContent onOpenAutoFocus={refreshCategories}>
        <div className="mx-auto w-full max-w-screen-md p-4 space-y-4">
          <DrawerHeader>
            <DrawerTitle>Publish Post</DrawerTitle>
            <DrawerDescription>
              Review details and publish your post.
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input value={title} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Slug</label>
            <div className="flex gap-2">
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-post-slug"
              />
              <Button
                variant="secondary"
                onClick={generateUniqueSlug}
                disabled={!title}
              >
                Generate
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Categories</label>
            <div className="flex gap-2">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                variant="secondary"
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
            <div className="max-h-56 overflow-auto rounded-md border p-2 space-y-1">
              {categories.map((c: import("@/types").Category) => {
                const checked = selectedCategoryIds.has(c.id);
                return (
                  <label key={c.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked)
                          setCategoryIds([...categoryIds, c.id]);
                        else
                          setCategoryIds(
                            categoryIds.filter((id) => id !== c.id),
                          );
                      }}
                    />
                    <span>{c.name}</span>
                  </label>
                );
              })}
              {categories.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No categories yet.
                </div>
              )}
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-2">
              <Button
                onClick={() => submit("PUBLISHED")}
                disabled={!title || submitting}
              >
                Publish
              </Button>
              <Button
                variant="secondary"
                onClick={() => submit("DRAFT")}
                disabled={!title || submitting}
              >
                Save as draft
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
