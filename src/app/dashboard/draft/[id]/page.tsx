"use client";

import Editor from "@/components/editor/editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/utils/uploadthing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, X, FileEdit } from "lucide-react";
import { useEditorStore } from "@/stores/editor";
import { useEffect, useMemo, useState } from "react";
import { useTRPC } from "@/trpc/trpc-provider";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { Badge } from "@/components/ui/badge";

export default function Page(props: { params: { id: string } }) {
  const id = Number(props.params.id);

  const trpc = useTRPC();
  const trpcClient = useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [httpBatchLink({ url: "/api/trpc" })],
      }),
    [],
  );

  const {
    setPostId,
    setTitle,
    setSlug,
    setHeroImage,
    setCategoryIds,
    setStatus,
    setDescription,
  } = useEditorStore();

  const [uploading, setUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const post = await trpcClient.posts.getById.query({ id });
      if (!post) return;
      setPostId(post.id);
      setTitle(post.title);
      setSlug(post.slug);
      setHeroImage(post.heroImage ?? null);
      setCategoryIds((post as any).categories?.map((c: any) => c.id) ?? []);
      setStatus("DRAFT");
      setDescription(post.description ?? "");
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "novel-content",
          JSON.stringify(post.content),
        );
      }
      setIsLoading(false);
    })();
  }, [id, trpcClient]);

  const { title, setTitle: setTitleLocal, description, setDescription: setDescLocal, heroImage, setHeroImage: setHeroImageLocal } = useEditorStore();

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading draft...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full bg-background">
      <div className="container mx-auto max-w-4xl py-8 md:py-12 px-4 md:px-6">
        {/* Status Badge */}
        <div className="mb-6">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
            <FileEdit className="size-3" />
            Draft
          </Badge>
        </div>

        {/* Hero Image Section */}
        <div className="mb-8">
          {heroImage ? (
            <div className="group relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-border/50 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Cover"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                onClick={() => setHeroImageLocal(null)}
              >
                <X className="size-4" />
              </Button>
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-xs text-white/80 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Click to change cover
                </span>
              </div>
            </div>
          ) : (
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <button className="group w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ImageIcon className="size-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Add a cover image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 1200 x 630px
                    </p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Cover Image</DialogTitle>
                </DialogHeader>
                <UploadDropzone
                  endpoint="imageUploader"
                  onUploadBegin={() => setUploading(true)}
                  onClientUploadComplete={(res) => {
                    setUploading(false);
                    const url = res?.[0]?.url;
                    if (url) setHeroImageLocal(url);
                    setIsUploadDialogOpen(false);
                  }}
                  onUploadError={() => setUploading(false)}
                  appearance={{
                    button:
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 shadow-sm",
                    container: "border-2 border-dashed border-border/50 rounded-xl p-8 bg-muted/20",
                    label: "text-foreground font-medium",
                    allowedContent: "text-muted-foreground text-xs",
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Title & Description Section */}
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <Input
              placeholder="Give your post a title..."
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40 h-auto py-2 bg-transparent"
              value={title}
              onChange={(e) => setTitleLocal(e.target.value)}
            />
            <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
          </div>

          <Textarea
            placeholder="Write a brief description that captures the essence of your post..."
            className="min-h-[100px] text-lg text-muted-foreground border-none px-0 shadow-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/40 bg-transparent leading-relaxed"
            value={description}
            onChange={(e) => setDescLocal(e.target.value)}
          />
        </div>

        {/* Editor Section */}
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 via-amber-500/10 to-transparent hidden md:block" />
          <div className="prose md:prose-lg dark:prose-invert max-w-none">
            <Editor />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
