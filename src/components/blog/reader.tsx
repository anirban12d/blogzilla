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
        className="relative min-h-[200px] w-full max-w-5xl"
        editorProps={{
          attributes: {
            class:
              "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
          },
        }}
        slotAfter={<ImageResizer />}
      />
    </EditorRoot>
  );
}
