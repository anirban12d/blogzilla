import { createImageUpload } from "novel";
import { toast } from "sonner";
import { uploadImageViaUploadThing } from "./uploadthing";

const onUpload = (file: File) => {
  const promise = uploadImageViaUploadThing(file);

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then((url) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(url);
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 16) {
      toast.error("File size too big (max 16MB).");
      return false;
    }
    return true;
  },
});
