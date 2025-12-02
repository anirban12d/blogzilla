import { UserButton } from "@daveyplate/better-auth-ui";
import { Plus } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "./dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex px-4 py-4 items-center justify-between bg-background/80 backdrop-blur-md border-b border-border/50">
      <Link href="/">
        <Image
          src={"/blogzilla.png"}
          alt="Blogzilla"
          width={192}
          height={64}
          className="w-auto h-12"
        />
      </Link>
      <div className="flex items-center justify-center gap-2">
        <SearchBar />
        <Link href="/dashboard/new">
          <Button variant="default" size="sm" className="h-9 w-9 px-0 md:w-auto md:px-4">
            <Plus className="h-4 w-4 md:hidden" />
            <span className="hidden md:inline">Create Post</span>
          </Button>
        </Link>
        <ModeToggle />
        <UserButton size="icon" />
      </div>
    </header>
  );
}
