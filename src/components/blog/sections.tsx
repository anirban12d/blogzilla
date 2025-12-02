"use client";

import { useState } from "react";

import { useTRPC } from "@/trpc/trpc-provider";
import { PostCard, PostCardSkeleton } from "./post-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardSkeleton } from "@/components/ui/skeletons";

export function FeaturedPostsSection() {
  const trpc = useTRPC();
  const [data] = trpc.posts.listPublic.useSuspenseQuery({});
  const items = (data ?? []).slice(0, 3);

  if (items.length === 0) return null;

  const heroPost = items[0];
  const sidePosts = items.slice(1, 3);

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Featured</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Card */}
        <div className="lg:col-span-2 group relative overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
          <Link href={`/blog/${heroPost.slug}`} className="block h-full">
            <div className="relative h-full min-h-[300px] w-full overflow-hidden">
              {heroPost.heroImage && (
                <img
                  src={heroPost.heroImage}
                  alt={heroPost.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white space-y-3">
                {(heroPost as any).categories && (heroPost as any).categories.length > 0 && (
                  <div className="flex gap-2">
                    {((heroPost as any).categories as any[]).slice(0, 3).map((c) => (
                      <Badge key={c.id} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold leading-tight">{heroPost.title}</h3>
                {heroPost.description && (
                  <p className="text-white/80 line-clamp-2 text-lg max-w-2xl">{heroPost.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-white/60 pt-2">
                  <span>{heroPost.authorName || "Author"}</span>
                  <span>•</span>
                  <span>{new Date(heroPost.createdAt as any).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Side Cards */}
        <div className="space-y-6 flex flex-col">
          {sidePosts.map((post) => (
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      </div>
      <Separator className="my-8" />
    </section>
  );
}

export function AllPostsSection() {
  const trpc = useTRPC();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [posts, { error: postsError, isPending: isPostsPending }] = trpc.posts.listPublic.useSuspenseQuery({});

  const [categories] = trpc.categories.list.useSuspenseQuery({ order: "asc" });



  if (postsError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load posts</AlertTitle>
        <AlertDescription>{postsError.message}</AlertDescription>
      </Alert>
    );
  }

  // Filter posts
  // 1. Exclude the first 3 (featured)
  // 2. Filter by category if selected
  const allPosts = (posts ?? []) as any[];
  const featuredIds = allPosts.slice(0, 3).map(p => p.id);

  const filteredPosts = allPosts.filter(post => {
    const isFeatured = featuredIds.includes(post.id);
    if (isFeatured) return false;

    if (selectedCategory) {
      return post.categories?.some((c: any) => c.slug === selectedCategory);
    }
    return true;
  });

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Latest Stories</h2>

        {/* Category Filter */}
        <div className="w-full md:w-[200px]">
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full rounded-full bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((p: any) => (
            <PostCard key={p.id} post={p as any} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p>No posts found in this category.</p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-primary hover:underline mt-2"
          >
            View all posts
          </button>
        </div>
      )}
    </section>
  );
}


