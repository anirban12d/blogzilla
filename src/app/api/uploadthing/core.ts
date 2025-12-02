import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Uploaded:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
