"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { SearchIcon, FileText, User, Calendar } from "lucide-react";
import { useTRPC } from "@/trpc/trpc-provider";

export function SearchCommand() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const router = useRouter();
    const trpc = useTRPC();

    const { data: results, isPending } = trpc.posts.search.useQuery(
        { query: debouncedQuery },
        { enabled: debouncedQuery.length > 0 }
    );

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (slug: string) => {
        setOpen(false);
        router.push(`/blog/${slug}`);
    };

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 md:w-40 md:justify-start md:px-3 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline-flex">Search posts...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {isPending ? "Searching..." : "No results found."}
                    </CommandEmpty>
                    {results && results.length > 0 && (
                        <CommandGroup heading="Posts">
                            {results.map((post) => (
                                <CommandItem
                                    key={post.id}
                                    value={`${post.title} ${post.authorName}`}
                                    onSelect={() => handleSelect(post.slug)}
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                        <span>{post.title}</span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.authorName}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(post.createdAt as any).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
