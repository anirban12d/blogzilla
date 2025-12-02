"use client";


import { useTRPC } from "@/trpc/trpc-provider";
import { EditorReader } from "./reader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowLeft, Calendar, Clock, Edit2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto max-w-4xl px-6 py-12 md:py-16 space-y-8">
          {/* Navigation */}
          <Button asChild variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Header Content */}
          <div className="space-y-6">
            {(data as any).categories && (data as any).categories.length > 0 && (
              <div className="flex gap-2">
                {(data as any).categories.map((c: any) => (
                  <Badge key={c.id} variant="secondary" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border-none">
                    {c.name}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {data.title}
            </h1>

            {data.description && (
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                {data.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">{data.authorName || "Author"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>5 min read</span>
              </div>

              {canEdit && (
                <Button asChild variant="outline" size="sm" className="ml-auto gap-2">
                  <Link href={`/dashboard/published/${data.id}`}>
                    <Edit2 className="size-3" />
                    Edit Post
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {data.heroImage && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border bg-muted shadow-sm">
              <img
                src={data.heroImage}
                alt={data.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="pt-8">
            <EditorReader content={data.content as any} />

            <Separator className="my-12" />

            <div className="flex justify-between items-center">
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to all posts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
