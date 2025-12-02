import { create } from "zustand";

type EditorState = {
  postId: number | null;
  title: string;
  slug: string;
  heroImage: string | null;
  categoryIds: number[];
  status: "DRAFT" | "PUBLISHED" | null;
  isDirty: boolean;
  description: string;
  setPostId: (id: number | null) => void;
  setTitle: (title: string) => void;
  setSlug: (slug: string) => void;
  setHeroImage: (url: string | null) => void;
  setCategoryIds: (ids: number[]) => void;
  setStatus: (status: "DRAFT" | "PUBLISHED" | null) => void;
  setDirty: (dirty: boolean) => void;
  setDescription: (desc: string) => void;
  reset: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  postId: null,
  title: "",
  slug: "",
  heroImage: null,
  categoryIds: [],
  status: null,
  isDirty: false,
  description: "",
  setPostId: (postId) => set({ postId }),
  setTitle: (title) => set({ title }),
  setSlug: (slug) => set({ slug }),
  setHeroImage: (url) => set({ heroImage: url }),
  setCategoryIds: (ids) => set({ categoryIds: ids }),
  setStatus: (status) => set({ status }),
  setDirty: (isDirty) => set({ isDirty }),
  setDescription: (description) => set({ description }),
  reset: () =>
    set({
      postId: null,
      title: "",
      slug: "",
      heroImage: null,
      categoryIds: [],
      status: null,
      isDirty: false,
      description: "",
    }),
}));
