"use client";

import * as React from "react";
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { NavFavorites } from "./nav-favorites";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { useTRPC } from "@/trpc/trpc-provider";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editor";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserButton } from "@daveyplate/better-auth-ui";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const trpc = useTRPC();
  const utils = trpc.useUtils();
  const router = useRouter();
  const {
    isDirty,
    setDirty,
    setStatus,
    setPostId,
    setTitle,
    setSlug,
    setHeroImage,
    setCategoryIds,
  } = useEditorStore();
  const trpcClient = React.useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [httpBatchLink({ url: "/api/trpc" })],
      }),
    [],
  );
  const [pendingId, setPendingId] = React.useState<number | null>(null);
  const [pendingStatus, setPendingStatus] = React.useState<
    "DRAFT" | "PUBLISHED" | null
  >(null);

  const { data: myPosts = [] } = trpc.posts.listMine.useQuery();

  const drafts = (myPosts ?? [])
    .filter((p: any) => (p as any).status === "DRAFT")
    .map((p: any) => ({ name: p.title as string, id: p.id as number, slug: p.slug as string }));
  const published = (myPosts ?? [])
    .filter((p: any) => (p as any).status === "PUBLISHED")
    .map((p: any) => ({ name: p.title as string, id: p.id as number, slug: p.slug as string }));

  async function proceedTo(id: number, status: "DRAFT" | "PUBLISHED") {
    const full = (myPosts as any[]).find((p) => p.id === id);
    if (!full) return;
    setPostId(full.id);
    setTitle(full.title);
    setSlug(full.slug);
    setHeroImage(full.heroImage ?? null);
    setCategoryIds((full as any).categories?.map((c: any) => c.id) ?? []);
    setStatus(status);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "novel-content",
        JSON.stringify(full.content),
      );
    }
    router.push(
      status === "DRAFT"
        ? `/dashboard/draft/${id}`
        : `/dashboard/published/${id}`,
    );
  }

  async function handleSelectPost(item: { id?: number }) {
    if (!item.id) return;
    const status = (myPosts as any[]).find((p) => p.id === item.id)?.status as
      | "DRAFT"
      | "PUBLISHED";
    if (isDirty) {
      setPendingId(item.id);
      setPendingStatus(status);
      const dialog = document.getElementById("unsaved-dialog-trigger");
      (dialog as HTMLButtonElement | null)?.click();
      return;
    }
    await proceedTo(item.id, status);
  }

  return (
    <Sidebar className="border-r border-sidebar-border/50 bg-sidebar/80 backdrop-blur-md" {...props}>
      <SidebarHeader>
        <Link href="/">
          <Image
            src={"/blogzilla.png"}
            alt="Blogzilla"
            width={192}
            height={64}
            className="w-[60%]"
          />
        </Link>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        {drafts.length > 0 && (
          <NavFavorites
            groupLabel="Drafts"
            favorites={drafts}
            onSelect={handleSelectPost}
          />
        )}
        <NavFavorites
          groupLabel="Published"
          favorites={published}
          onSelect={handleSelectPost}
        />
      </SidebarContent>
      {/* Hidden trigger for alert dialog programmatic open */}
      <AlertDialog>
        <AlertDialogTrigger id="unsaved-dialog-trigger" className="hidden" />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Save as draft or discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPendingId(null);
                setPendingStatus(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // discard path
                if (typeof window !== "undefined") {
                  window.localStorage.removeItem("novel-content");
                }
                setDirty(false);
                if (pendingId && pendingStatus)
                  await proceedTo(pendingId, pendingStatus);
              }}
            >
              Discard
            </AlertDialogAction>
            <AlertDialogAction
              onClick={async () => {
                // save as draft path
                try {
                  const contentStr =
                    typeof window !== "undefined"
                      ? window.localStorage.getItem("novel-content")
                      : null;
                  const content = contentStr ? JSON.parse(contentStr) : {};
                  if (pendingId) {
                    await trpcClient.posts.update.mutate({
                      id: pendingId,
                      content,
                      status: "DRAFT",
                      published: false,
                    });
                    // Invalidate lists to refresh sidebar and any public listings
                    await Promise.all([
                      utils.posts.listMine.invalidate(),
                      utils.posts.listPublic.invalidate(),
                    ]);
                    await proceedTo(pendingId, "DRAFT");
                  }
                } finally {
                  setDirty(false);
                }
              }}
            >
              Save draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SidebarFooter>
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        <UserButton className="bg-inherit dark:text-white text-black dark:hover:text-black" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
