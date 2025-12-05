"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/trpc-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, TrendingUp, Zap } from "lucide-react";

// Hero Section - Large featured post
export function HeroSection() {
  const trpc = useTRPC();
  const [data] = trpc.posts.listPublic.useSuspenseQuery({});
  const heroPost = data?.[0];

  if (!heroPost) return null;

  const formattedDate = new Date(heroPost.createdAt as any).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative">
      <Link href={`/blog/${heroPost.slug}`} className="group block">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted">
          {heroPost.heroImage ? (
            <Image
              src={heroPost.heroImage}
              alt={`Featured: ${heroPost.title}`}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-none">
                  Featured
                </Badge>
                {(heroPost as any).categories?.[0] && (
                  <Badge variant="secondary" className="bg-white/15 text-white border-none backdrop-blur-sm">
                    {(heroPost as any).categories[0].name}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {heroPost.title}
              </h1>

              {heroPost.description && (
                <p className="text-white/70 text-base md:text-lg max-w-2xl line-clamp-2">
                  {heroPost.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-white/60 pt-2">
                <span className="font-medium text-white/80">{heroPost.authorName || "Author"}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{formattedDate}</span>
                {heroPost.readingTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {heroPost.readingTime} min read
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

// Category Pills Navigation
export function CategoryNav() {
  const trpc = useTRPC();
  const [categories] = trpc.categories.list.useSuspenseQuery({ order: "asc" });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedCategory(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
          selectedCategory === null
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            selectedCategory === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

// Trending/Popular Posts - Horizontal scroll
export function TrendingSection() {
  const trpc = useTRPC();
  const [data] = trpc.posts.listPublic.useSuspenseQuery({});
  const trendingPosts = (data ?? []).slice(1, 5);

  if (trendingPosts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10">
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Trending Now</h2>
            <p className="text-sm text-muted-foreground">Most popular this week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-md transition-all"
          >
            <span className="text-4xl font-bold text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{post.authorName || "Author"}</span>
                {post.readingTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span>{post.readingTime} min</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Main Posts Grid with sidebar layout
export function MainContentSection() {
  const trpc = useTRPC();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [posts] = trpc.posts.listPublic.useSuspenseQuery({});
  const [categories] = trpc.categories.list.useSuspenseQuery({ order: "asc" });

  const allPosts = (posts ?? []) as any[];
  // Skip the first post (hero) and first 4 (trending)
  const mainPosts = allPosts.slice(5);

  const filteredPosts = selectedCategory
    ? mainPosts.filter(post => post.categories?.some((c: any) => c.slug === selectedCategory))
    : mainPosts;

  const recentPosts = allPosts.slice(1, 6);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All Posts
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No posts found in this category.</p>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                View all posts
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-8">
        {/* Recent Posts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Recent Posts
          </h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 items-start"
              >
                {post.heroImage ? (
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={post.heroImage}
                      alt={`Thumbnail: ${post.title}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-muted-foreground/40">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(post.createdAt as any).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-all",
                  selectedCategory === category.slug
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <h3 className="font-semibold mb-2">Stay Updated</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest posts delivered straight to your inbox.
          </p>
          <Button className="w-full" size="sm">
            Subscribe
          </Button>
        </div>
      </aside>
    </section>
  );
}

// Article Card Component - Horizontal layout
function ArticleCard({ post }: { post: any }) {
  const formattedDate = new Date(post.createdAt as any).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="sm:w-48 md:w-56 flex-shrink-0">
          {post.heroImage ? (
            <div className="relative w-full h-40 sm:h-36 rounded-xl overflow-hidden">
              <Image
                src={post.heroImage}
                alt={`Article: ${post.title}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 224px"
              />
            </div>
          ) : (
            <div className="w-full h-40 sm:h-36 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted flex items-center justify-center">
              <span className="text-3xl font-bold text-primary/30">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-3">
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2">
                {post.categories.slice(0, 2).map((c: any) => (
                  <Badge
                    key={c.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {c.name}
                  </Badge>
                ))}
              </div>
            )}

            <h2 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            {post.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {post.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-4">
            <span className="font-medium text-foreground/80">{post.authorName || "Author"}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>{formattedDate}</span>
            {post.readingTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} min
                </span>
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
          </div>
        </div>
      </article>
    </Link>
  );
}

// Featured Grid - 2 column layout for featured posts
export function FeaturedGrid() {
  const trpc = useTRPC();
  const [data] = trpc.posts.listPublic.useSuspenseQuery({});
  const featuredPosts = (data ?? []).slice(1, 3);

  if (featuredPosts.length === 0) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {featuredPosts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
        >
          {post.heroImage ? (
            <Image
              src={post.heroImage}
              alt={`Featured: ${post.title}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            {(post as any).categories?.[0] && (
              <Badge variant="secondary" className="bg-white/15 text-white border-none backdrop-blur-sm text-xs">
                {(post as any).categories[0].name}
              </Badge>
            )}
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span className="font-medium text-white/80">{post.authorName || "Author"}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>
                {new Date(post.createdAt as any).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}

// Legacy exports for backward compatibility
export function FeaturedPostsSection() {
  return <HeroSection />;
}

export function AllPostsSection() {
  return <MainContentSection />;
}
