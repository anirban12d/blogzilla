import { siteConfig, getBaseUrl } from "./config";

type BlogPost = {
  title: string;
  slug: string;
  description?: string | null;
  heroImage?: string | null;
  authorName?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  categories?: Array<{ name: string; slug: string }> | null;
};

// Generate JSON-LD for a blog post (Article schema)
export function generateArticleJsonLd(post: BlogPost) {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description || `Read ${post.title} on ${siteConfig.name}`,
    image: post.heroImage || `${baseUrl}${siteConfig.ogImage}`,
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : new Date(post.createdAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName || "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    keywords: post.categories?.map((c) => c.name).join(", ") || undefined,
  };
}

// Generate JSON-LD for the blog listing page (Blog schema)
export function generateBlogJsonLd() {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: siteConfig.name,
    description: siteConfig.description,
    url: baseUrl,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}

// Generate JSON-LD for organization (WebSite schema)
export function generateWebsiteJsonLd() {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Generate BreadcrumbList JSON-LD
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
