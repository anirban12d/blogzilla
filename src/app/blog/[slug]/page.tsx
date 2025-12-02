import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorBoundary } from "@/components/ui/error-boundary";
import { PostSkeleton } from "@/components/ui/skeletons";
import { PostViewer } from "@/components/blog/post-viewer";

export default async function BlogPostPage(props: {
  params: { slug: string };
}) {
  const { slug } = props.params;
  return (
    <HydrateClient>
      <main className="min-h-screen bg-background">
        <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
          <Suspense fallback={<PostSkeleton />}>
            <PostViewer slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </HydrateClient>
  );
}
