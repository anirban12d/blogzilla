"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/types";

type PostCardProps = {
  post: Post & {
    categories?: { id: number; name: string; slug: string }[];
    description?: string | null; // short description
    authorName?: string | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const createdAt = new Date(
    post.createdAt as unknown as string,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const colorClasses = [
    "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-transparent",
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-transparent",
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-transparent",
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-transparent",
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-transparent",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-transparent",
    "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-transparent",
  ];

  const colorFor = (seed: string, idx: number) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++)
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    const index = (hash + idx) % colorClasses.length;
    return colorClasses[index];
  };

  return (
    <Card className="group overflow-hidden rounded-2xl pt-0 border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md">
      {post.heroImage ? (
        <Link href={`/blog/${post.slug}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      ) : null}
      <CardContent className="p-4 space-y-3">
        <div className="text-xs font-medium text-primary/80">
          <span className="text-primary">
            {post.authorName ? post.authorName : "Author"}
          </span>
          <span className="mx-1">•</span>
          <span>{createdAt}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="flex items-start gap-2">
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
              {post.title}
            </h3>
            <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </Link>
        {post.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.description}
          </p>
        ) : post.readingTime ? (
          <div className="text-xs text-muted-foreground">
            {post.readingTime} min read
          </div>
        ) : null}
        {post.categories && post.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.categories.slice(0, 2).map((c, i) => (
              <Badge
                key={c.id}
                variant="secondary"
                className={`rounded-full px-2 py-0.5 text-xs ${colorFor(c.slug ?? c.name, i)}`}
              >
                {c.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 w-full bg-muted" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-5 w-3/4 bg-muted rounded" />
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
