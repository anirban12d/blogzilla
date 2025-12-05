import { UserButton } from "@daveyplate/better-auth-ui";
import { PenLine } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "./dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search/search-bar";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src={"/blogzilla.png"}
            alt="Blogzilla"
            width={160}
            height={48}
            className="w-auto h-10"
          />
        </Link>
        <div className="flex items-center gap-3">
          <SearchBar />
          <Link href="/dashboard/new">
            <Button size="sm" className="gap-2">
              <PenLine className="h-4 w-4" />
              <span className="hidden sm:inline">Write</span>
            </Button>
          </Link>
          <div className="flex items-center gap-1">
            <ModeToggle />
            <UserButton size="icon" />
          </div>
        </div>
      </div>
    </header>
  );
}
