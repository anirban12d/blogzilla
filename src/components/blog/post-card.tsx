"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Post } from "@/types";

type PostCardProps = {
  post: Post & {
    categories?: { id: number; name: string; slug: string }[];
    description?: string | null;
    authorName?: string | null;
  };
};

export function PostCard({ post }: PostCardProps) {
  const createdAt = new Date(
    post.createdAt as unknown as string,
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="group overflow-hidden rounded-xl pt-0 border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-border">
      {post.heroImage ? (
        <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.heroImage}
            alt={post.title}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ) : (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="h-44 w-full bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary/60">{post.title.charAt(0)}</span>
            </div>
          </div>
        </Link>
      )}
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">
            {post.authorName ? post.authorName : "Author"}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>{createdAt}</span>
          {post.readingTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min
              </span>
            </>
          )}
        </div>
        <Link href={`/blog/${post.slug}`} className="block group/title">
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight leading-snug group-hover/title:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        {post.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {post.description}
          </p>
        )}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.categories.slice(0, 2).map((c) => (
              <Badge
                key={c.id}
                variant="secondary"
                className="rounded-md px-2.5 py-0.5 text-xs font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground border-none"
              >
                {c.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border border-border/50">
      <div className="h-44 w-full bg-muted animate-pulse" />
      <CardContent className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-full bg-muted rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-muted rounded-md animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded-md animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
