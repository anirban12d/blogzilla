// SEO Configuration
export const siteConfig = {
  name: "Blogzilla",
  description: "A modern tech blog featuring insights on software development, AI, cloud computing, and emerging technologies.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://blogzilla.vercel.app",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/blogzilla",
    github: "https://github.com/blogzilla",
  },
  creator: "Blogzilla Team",
  keywords: [
    "tech blog",
    "software development",
    "programming",
    "web development",
    "artificial intelligence",
    "machine learning",
    "cloud computing",
    "DevOps",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
  ],
};

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
