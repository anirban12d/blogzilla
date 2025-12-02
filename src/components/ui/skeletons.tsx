import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl px-6 py-12 md:py-16 space-y-8">
            {/* Navigation */}
            <Skeleton className="h-9 w-32" />

            {/* Header Content */}
            <div className="space-y-6">
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-12 w-1/2" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-6 w-full max-w-2xl" />
                    <Skeleton className="h-6 w-2/3" />
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Hero Image */}
            <Skeleton className="w-full aspect-video rounded-3xl" />

            {/* Content Section */}
            <div className="pt-8 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[160px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}

export function EditorSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-12 px-6 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
}

export function FeaturedSkeleton() {
    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-32" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hero Card Skeleton */}
                <div className="lg:col-span-2 h-[300px] rounded-3xl border bg-card shadow-sm overflow-hidden relative">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute bottom-0 left-0 p-6 w-full space-y-3">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
                            <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
                        </div>
                        <Skeleton className="h-8 w-3/4 bg-white/20" />
                        <Skeleton className="h-6 w-full bg-white/20" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-4 w-24 bg-white/20" />
                            <Skeleton className="h-4 w-32 bg-white/20" />
                        </div>
                    </div>
                </div>

                {/* Side Cards Skeleton */}
                <div className="space-y-6 flex flex-col">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        </div>
    );
}

export function PostsGridSkeleton() {
    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-10 w-full md:w-[200px] rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
