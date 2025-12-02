"use client";

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMemo } from "react";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import { useTRPC } from "@/trpc/trpc-provider";

import { toast } from "sonner";

export function NavFavorites({
  favorites,
  groupLabel = "Favorites",
  onSelect,
}: {
  favorites: {
    name: string;
    url?: string;
    emoji?: string;
    id?: number;
    slug?: string;
  }[];
  groupLabel?: string;
  onSelect?: (item: { name: string; id?: number; slug?: string }) => void;
}) {
  const { isMobile } = useSidebar();
  const trpc = useTRPC();
  const utils = trpc.useUtils();
  const trpcClient = useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [httpBatchLink({ url: "/api/trpc" })],
      }),
    [],
  );

  async function resolveUrl(item: { id?: number; slug?: string }) {
    if (groupLabel === "Published") {
      if (item.slug) return `/blog/${item.slug}`;
      if (item.id) {
        const post = await trpcClient.posts.getById.query({ id: item.id });
        if (post?.slug) return `/blog/${post.slug}`;
      }
      return "#";
    }
    if (groupLabel === "Drafts" && item.id) return `/dashboard/draft/${item.id}`;
    if (item.id) return `/dashboard/published/${item.id}`;
    return "#";
  }

  async function handleOpen(item: { id?: number; slug?: string }) {
    const url = await resolveUrl(item);
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCopy(item: { id?: number; slug?: string }) {
    const url = await resolveUrl(item);
    if (url && url !== "#") {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }

  async function handleDelete(item: { id?: number }) {
    if (!item.id) return;
    const yes = window.confirm("Delete this post?");
    if (!yes) return;
    await trpcClient.posts.delete.mutate({ id: item.id });
    await Promise.all([
      utils.posts.listMine.invalidate(),
      utils.posts.listPublic.invalidate(),
    ]);
    toast.success("Post deleted");
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item.name}>
            {onSelect ? (
              <SidebarMenuButton onClick={() => onSelect(item)}>
                <span>{item.emoji ?? "📝"}</span>
                <span>{item.name}</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild>
                <a href={item.url ?? "#"} title={item.name}>
                  <span>{item.emoji ?? "📝"}</span>
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async (e) => {
                    e.preventDefault();
                    await handleCopy(item);
                  }}
                >
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={async (e) => {
                    e.preventDefault();
                    await handleOpen(item);
                  }}
                >
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async (e) => {
                    e.preventDefault();
                    await handleDelete(item);
                  }}
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
