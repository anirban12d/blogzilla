import { HydrateClient, trpc, prefetch } from "@/trpc/server";
import { Suspense } from "react";
import {
  HeroSkeleton,
  TrendingSkeleton,
  MainContentSkeleton,
  FeaturedGridSkeleton,
} from "@/components/ui/skeletons";
import { ErrorBoundary } from "react-error-boundary";
import {
  HeroSection,
  FeaturedGrid,
  TrendingSection,
  MainContentSection,
} from "@/components/blog/sections";
import { Metadata } from "next";
import { siteConfig } from "@/lib/seo/config";
import { generateBlogJsonLd } from "@/lib/seo/structured-data";
import Script from "next/script";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.name} - Tech Blog & Insights`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - Tech Blog & Insights`,
    description: siteConfig.description,
  },
};

export default async function Home() {
  void prefetch(trpc.posts.listPublic.queryOptions({}));
  void prefetch(trpc.categories.list.queryOptions({ order: "asc" }));

  const blogJsonLd = generateBlogJsonLd();

  return (
    <>
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <HydrateClient>
        <main className="min-h-screen bg-background">
          <ErrorBoundary fallback={<div className="p-8 text-center">Something went wrong</div>}>
          {/* Hero Section - Full width featured post */}
          <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pt-8 md:pt-12">
            <Suspense fallback={<HeroSkeleton />}>
              <HeroSection />
            </Suspense>
          </section>

          {/* Featured Grid - Two column featured posts */}
          <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10 md:py-14">
            <Suspense fallback={<FeaturedGridSkeleton />}>
              <FeaturedGrid />
            </Suspense>
          </section>

          {/* Trending Section */}
          <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pb-10 md:pb-14">
            <Suspense fallback={<TrendingSkeleton />}>
              <TrendingSection />
            </Suspense>
          </section>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Main Content with Sidebar */}
          <section className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10 md:py-14">
            <Suspense fallback={<MainContentSkeleton />}>
              <MainContentSection />
            </Suspense>
          </section>
          </ErrorBoundary>
        </main>
      </HydrateClient>
    </>
  );
}
