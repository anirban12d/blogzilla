"use client";

import * as React from "react";
import {
  ArrowDown,
  Eye,
  Link,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "../header/dark-mode-toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEditorStore } from "@/stores/editor";
import { useTRPC } from "@/trpc/trpc-provider";

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { slug, postId, title, description } = useEditorStore();
  const trpc = useTRPC();
  const utils = trpc.useUtils();

  const trpcClient = React.useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [httpBatchLink({ url: "/api/trpc" })],
      }),
    []
  );

  const handleCopyLink = () => {
    if (slug) {
      const url = `${window.location.origin}/blog/${slug}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } else {
      toast.error("Save the post first to copy link");
    }
    setIsOpen(false);
  };

  const handlePreview = () => {
    if (slug) {
      window.open(`/blog/${slug}`, "_blank");
    } else {
      toast.error("Save the post first to preview");
    }
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (postId) {
      const yes = window.confirm("Delete this post?");
      if (!yes) return;
      try {
        await trpcClient.posts.delete.mutate({ id: postId });
        await Promise.all([
          utils.posts.listMine.invalidate(),
          utils.posts.listPublic.invalidate(),
        ]);
        toast.success("Post deleted");
        router.push("/dashboard");
      } catch {
        toast.error("Failed to delete post");
      }
    } else {
      toast.error("No post to delete");
    }
    setIsOpen(false);
  };

  const handleExport = () => {
    const state = useEditorStore.getState();
    if (state.title || state.description) {
      const exportContent = `# ${state.title}\n\n${state.description || ""}`;
      const blob = new Blob([exportContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug || "untitled"}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Post exported as Markdown");
    } else {
      toast.error("No content to export");
    }
    setIsOpen(false);
  };

  type ActionItem = {
    label: string;
    icon: typeof Link;
    onClick: () => void;
    destructive?: boolean;
  };

  const actions: ActionItem[][] = [
    [
      { label: "Copy Link", icon: Link, onClick: handleCopyLink },
      { label: "Preview", icon: Eye, onClick: handlePreview },
    ],
    [
      { label: "Export as Markdown", icon: ArrowDown, onClick: handleExport },
    ],
    [
      { label: "Move to Trash", icon: Trash2, onClick: handleDelete, destructive: true },
    ],
  ];

  return (
    <div className="flex items-center gap-2 text-sm">
      <ModeToggle />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent h-7 w-7"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {actions.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, idx) => (
                        <SidebarMenuItem key={idx}>
                          <SidebarMenuButton
                            onClick={item.onClick}
                            className={item.destructive ? "text-destructive hover:text-destructive" : ""}
                          >
                            <item.icon className="h-4 w-4" /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
