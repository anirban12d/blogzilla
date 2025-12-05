"use client";

import { useTRPC } from "@/trpc/trpc-provider";
import { EditorReader } from "./reader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth/auth-client";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowLeft, Calendar, Clock, Edit2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PostViewer(props: { slug: string }) {
  const trpc = useTRPC();
  const [data, { error }] = trpc.posts.getBySlug.useSuspenseQuery({ slug: props.slug });
  const session = authClient.useSession();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load post</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  if (!data) {
    return (
      <Alert>
        <AlertTitle>Not found</AlertTitle>
        <AlertDescription>This post does not exist.</AlertDescription>
      </Alert>
    );
  }

  const canEdit = session.data?.user?.id === data.authorId;
  const formattedDate = new Date(data.createdAt as unknown as string).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollArea className="h-screen w-full">
      <article className="min-h-screen bg-background">
        {/* Hero Section */}
        {data.heroImage && (
          <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
            <Image
              src={data.heroImage}
              alt={`Hero image for ${data.title}`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        )}

        <div className={`container mx-auto max-w-2xl lg:max-w-3xl px-4 sm:px-6 lg:px-8 ${data.heroImage ? '-mt-24 md:-mt-32 relative z-10' : 'pt-8 md:pt-12 lg:pt-16'}`}>
          {/* Navigation */}
          <Button asChild variant="ghost" size="sm" className={`mb-6 md:mb-8 -ml-2 ${data.heroImage ? 'text-white/90 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground'}`}>
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>

          {/* Header Content */}
          <header className="space-y-4 md:space-y-6">
            {(data as any).categories && (data as any).categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(data as any).categories.map((c: any) => (
                  <Badge key={c.id} variant="secondary" className="rounded-md px-3 py-1 text-xs font-medium">
                    {c.name}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.2]">
              {data.title}
            </h1>

            {data.description && (
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground pt-4 pb-6 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="size-8 md:size-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-3.5 md:size-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">{data.authorName || "Author"}</span>
              </div>

              <span className="hidden sm:inline text-border">·</span>

              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 md:size-4" />
                <span>{formattedDate}</span>
              </div>

              <span className="hidden sm:inline text-border">·</span>

              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 md:size-4" />
                <span>5 min read</span>
              </div>

              {canEdit && (
                <Button asChild variant="outline" size="sm" className="gap-2 ml-auto">
                  <Link href={`/dashboard/published/${data.id}`}>
                    <Edit2 className="size-3" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>
          </header>

          {/* Content Section */}
          <div className="py-8 md:py-10 lg:py-12">
            <EditorReader content={data.content as any} />
          </div>

          {/* Footer */}
          <footer className="border-t border-border/50 py-8 md:py-12 mb-8">
            <div className="flex justify-center">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to all posts
                </Link>
              </Button>
            </div>
          </footer>
        </div>
      </article>
    </ScrollArea>
  );
}
