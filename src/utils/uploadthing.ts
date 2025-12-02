"use client";

import { genUploader } from "uploadthing/client";
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { uploadFiles: utUploadFiles } = genUploader<OurFileRouter>();

export async function uploadImageViaUploadThing(file: File): Promise<string> {
  try {
    const results = await utUploadFiles("imageUploader", { files: [file] });
    const first = results[0];
    if (first?.url) return first.url;
    throw new Error("Upload failed");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    throw new Error(message);
  }
}

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();


