import { Skeleton } from "@/components/ui/skeleton";

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-muted">
      <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="h-12 w-full max-w-2xl" />
          <Skeleton className="h-12 w-3/4 max-w-xl" />
          <Skeleton className="h-6 w-full max-w-lg" />
          <div className="flex items-center gap-4 pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Featured Grid Skeleton
export function FeaturedGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Trending Section Skeleton
export function TrendingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
            <Skeleton className="w-12 h-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Content Section Skeleton (with sidebar)
export function MainContentSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-8">
        {/* Recent Posts */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="w-20 h-16 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="p-6 rounded-2xl border border-border/50 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  );
}

// Article Card Skeleton (horizontal layout)
export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border border-border/50 bg-card">
      <Skeleton className="sm:w-48 md:w-56 h-40 sm:h-36 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

// Post Viewer Skeleton
export function PostSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Skeleton */}
      <Skeleton className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] rounded-none" />

      <div className="container mx-auto max-w-2xl lg:max-w-3xl px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10">
        {/* Back Button */}
        <Skeleton className="h-9 w-20 rounded-lg mb-6 md:mb-8" />

        {/* Header */}
        <div className="space-y-4 md:space-y-6">
          {/* Categories */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <Skeleton className="h-8 sm:h-10 md:h-12 w-full" />
            <Skeleton className="h-8 sm:h-10 md:h-12 w-3/4" />
          </div>

          {/* Description */}
          <Skeleton className="h-6 w-2/3" />

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-4 pb-6 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 md:size-9 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Content */}
        <div className="py-8 md:py-10 lg:py-12 space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-40 w-full rounded-xl my-6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 py-8 md:py-12 mb-8 flex justify-center">
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Card Skeleton (for grid layouts)
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// Editor Skeleton
export function EditorSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-6 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

// Legacy exports for backward compatibility
export function FeaturedSkeleton() {
  return <HeroSkeleton />;
}

export function PostsGridSkeleton() {
  return <MainContentSkeleton />;
}
