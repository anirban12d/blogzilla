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
import { ImageIcon, X } from "lucide-react";
import { useEditorStore } from "@/stores/editor";
import { useEffect, useMemo, useState } from "react";
import { useTRPC } from "@/trpc/trpc-provider";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

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
  const { setPostId, setTitle, setSlug, setHeroImage, setCategoryIds, setStatus, setDescription } = useEditorStore();
  const [uploading, setUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const post = await trpcClient.posts.getById.query({ id });
      if (!post) return;
      setPostId(post.id);
      setTitle(post.title);
      setSlug(post.slug);
      setHeroImage(post.heroImage ?? null);
      setCategoryIds((post as any).categories?.map((c: any) => c.id) ?? []);
      setStatus("PUBLISHED");
      setDescription(post.description ?? "");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("novel-content", JSON.stringify(post.content));
      }
    })();
  }, [id, trpcClient]);

  const { title, setTitle: setTitleLocal, description, setDescription: setDescLocal, heroImage, setHeroImage: setHeroImageLocal } = useEditorStore();

  return (
    <ScrollArea className="h-full w-full bg-background">
      <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
        <div className="space-y-8">
          {/* Header / Meta Section */}
          <div className="space-y-4 group">
            {heroImage ? (
              <div className="relative w-full h-[300px] rounded-xl overflow-hidden group-hover:shadow-md transition-all">
                <img src={heroImage} alt="Cover" className="w-full h-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setHeroImageLocal(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-muted-foreground hover:text-foreground border-dashed h-12">
                    <ImageIcon className="size-4" />
                    Add Cover Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3",
                      container: "border-0 border-none outline-none",
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}

            <Input
              placeholder="Post Title"
              className="text-4xl md:text-5xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto py-2"
              value={title}
              onChange={(e) => setTitleLocal(e.target.value)}
            />

            <Textarea
              placeholder="Add a short description..."
              className="min-h-[80px] text-xl text-muted-foreground border-none px-0 shadow-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/50"
              value={description}
              onChange={(e) => setDescLocal(e.target.value)}
            />
          </div>

          <div className="prose md:prose-lg dark:prose-invert max-w-none">
            <Editor />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}


