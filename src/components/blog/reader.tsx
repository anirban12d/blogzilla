"use client";

import {
  EditorContent,
  EditorRoot,
  ImageResizer,
  type JSONContent,
} from "novel";
import { defaultExtensions } from "@/components/editor/extensions/extensions";

type ReaderProps = {
  content: JSONContent;
};

const extensions = [...defaultExtensions] as any;

export function EditorReader(props: ReaderProps) {
  return (
    <EditorRoot>
      <EditorContent
        initialContent={props.content}
        editable={false}
        extensions={extensions}
        className="relative w-full"
        editorProps={{
          attributes: {
            class:
              "prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:not-italic font-default focus:outline-none max-w-none",
          },
        }}
        slotAfter={<ImageResizer />}
      />
    </EditorRoot>
  );
}
