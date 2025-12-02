"use client";
import Editor from "@/components/editor/editor";
import { ImageIcon } from "lucide-react";
import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEditorStore } from "@/stores/editor";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const { title, setTitle, setHeroImage } = useEditorStore();
  const [uploading, setUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <ScrollArea className="px-4 py-10 w-full h-screen">
      <div className="w-full flex flex-col mx-auto gap-4 max-w-5xl">
        <div className="flex items-center flex-col md:flex-row justify-center gap-2">
          <InputGroup className="w-full">
            <Input
              placeholder="Enter a post title"
              className="outline-none border-none bg-transparent focus:ring-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputGroup>
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full md:w-min">
                <ImageIcon className="mr-1 h-4 w-4" />
                Upload Cover
              </Button>
            </DialogTrigger>
            <DialogContent>
              <UploadDropzone
                endpoint="imageUploader"
                onUploadBegin={() => setUploading(true)}
                onClientUploadComplete={(res) => {
                  setUploading(false);
                  const url = res?.[0]?.url;
                  if (url) setHeroImage(url);
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
        </div>
        <Editor />
      </div>
    </ScrollArea>
  );
}
