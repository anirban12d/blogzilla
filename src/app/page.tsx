import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { Suspense } from "react";
import { FeaturedSkeleton, PostsGridSkeleton } from "@/components/ui/skeletons";
import { ErrorBoundary } from "react-error-boundary";
import {
  FeaturedPostsSection,
  AllPostsSection,
} from "@/components/blog/sections";

export const dynamic = "force-dynamic";

export default async function Home() {
  void prefetch(trpc.posts.listPublic.queryOptions({}));
  void prefetch(trpc.categories.list.queryOptions({ order: "asc" }));

  return (
    <HydrateClient>
      <main className="container mx-auto px-4 py-10 space-y-8">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <div className="space-y-12">
            <Suspense fallback={<FeaturedSkeleton />}>
              <FeaturedPostsSection />
            </Suspense>

            <Suspense fallback={<PostsGridSkeleton />}>
              <AllPostsSection />
            </Suspense>
          </div>
        </ErrorBoundary>
      </main>
    </HydrateClient>
  );
}
