import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorBoundary } from "@/components/ui/error-boundary";
import { PostSkeleton } from "@/components/ui/skeletons";
import { PostViewer } from "@/components/blog/post-viewer";
import { db } from "@/lib/db/database-pool";
import { blogPosts } from "../../../../drizzle/schemas/blog-schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { siteConfig, getBaseUrl } from "@/lib/seo/config";
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/structured-data";
import Script from "next/script";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug));

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const baseUrl = getBaseUrl();
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const ogImage = post.heroImage || `${baseUrl}${siteConfig.ogImage}`;

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description:
      post.description ||
      `Read ${post.title} on ${siteConfig.name}. Explore tech insights and tutorials.`,
    keywords: [
      ...(post.categories as any[] || []).map((c: any) => c.name),
      ...siteConfig.keywords.slice(0, 5),
    ],
    authors: [{ name: post.authorName || "Anonymous" }],
    creator: post.authorName || siteConfig.creator,
    publisher: siteConfig.name,
    openGraph: {
      type: "article",
      locale: "en_US",
      url: postUrl,
      title: post.title,
      description:
        post.description ||
        `Read ${post.title} on ${siteConfig.name}. Explore tech insights and tutorials.`,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.authorName || "Anonymous"],
      tags: (post.categories as any[] || []).map((c: any) => c.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description:
        post.description ||
        `Read ${post.title} on ${siteConfig.name}. Explore tech insights and tutorials.`,
      images: [ogImage],
      creator: "@blogzilla",
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Use dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch post for JSON-LD
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug));

  const baseUrl = getBaseUrl();

  // Generate JSON-LD structured data
  const articleJsonLd = post
    ? generateArticleJsonLd({
        title: post.title,
        slug: post.slug,
        description: post.description,
        heroImage: post.heroImage,
        authorName: post.authorName,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        categories: post.categories as any,
      })
    : null;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
    { name: post?.title || "Post", url: `${baseUrl}/blog/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      {articleJsonLd && (
        <Script
          id="article-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <HydrateClient>
        <main className="min-h-screen bg-background">
          <ErrorBoundary FallbackComponent={GlobalErrorBoundary}>
            <Suspense fallback={<PostSkeleton />}>
              <PostViewer slug={slug} />
            </Suspense>
          </ErrorBoundary>
        </main>
      </HydrateClient>
    </>
  );
}
