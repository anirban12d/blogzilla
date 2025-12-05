import "dotenv/config";
import { db } from "@/lib/db/database-pool";
import { blogPosts } from "../../drizzle/schemas";
import { categories, postCategories } from "../../drizzle/schemas";
import { user } from "../../drizzle/schemas";
import { eq } from "drizzle-orm";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Tech blog post content generator
function createBlogContent(title: string, sections: string[]) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: sections[0],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Key Highlights" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: sections[1] }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Why This Matters" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: sections[2] }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Getting Started" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: sections[3] }],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Conclusion" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: sections[4] }],
      },
    ],
  };
}

// Tech blog posts data
const techBlogPosts = [
  {
    title: "The Future of AI: How Machine Learning is Transforming Industries",
    description: "Explore how artificial intelligence and machine learning are revolutionizing healthcare, finance, and everyday life.",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
    readingTime: 8,
    categoryNames: ["AI & Machine Learning", "Technology"],
    content: [
      "Artificial Intelligence has moved from science fiction to everyday reality. From the moment you wake up to personalized news feeds, to voice assistants helping you manage your day, AI is everywhere. But what does the future hold for this transformative technology?",
      "Recent breakthroughs in large language models, computer vision, and reinforcement learning have opened new possibilities. Companies are now deploying AI solutions that can diagnose diseases with remarkable accuracy, optimize supply chains in real-time, and even create art that challenges our understanding of creativity.",
      "For businesses, the implications are profound. Organizations that fail to adopt AI risk falling behind competitors who leverage these tools for efficiency gains, better customer experiences, and innovative products. The McKinsey Global Institute estimates that AI could add $13 trillion to the global economy by 2030.",
      "If you're looking to get started with AI, begin by identifying repetitive tasks in your workflow that could benefit from automation. Explore no-code AI tools that make it easy to build simple models without deep technical expertise. Consider taking online courses in machine learning fundamentals.",
      "The AI revolution is not coming—it's already here. The question isn't whether to embrace this technology, but how quickly you can adapt to harness its potential while navigating the ethical considerations it raises.",
    ],
  },
  {
    title: "Building Scalable Applications with Next.js 15 and React Server Components",
    description: "A comprehensive guide to leveraging the latest Next.js features for building performant, scalable web applications.",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    readingTime: 12,
    categoryNames: ["Web Development", "JavaScript"],
    content: [
      "Next.js 15 represents a paradigm shift in how we build React applications. With the stable release of React Server Components and improved streaming capabilities, developers now have unprecedented control over application performance and user experience.",
      "Server Components allow you to render components on the server without sending JavaScript to the client, dramatically reducing bundle sizes. Combined with Partial Prerendering, you can create applications that feel instant while still being dynamic and personalized.",
      "The performance benefits are substantial. Applications built with these patterns typically see 40-60% reductions in Time to First Byte (TTFB) and significant improvements in Core Web Vitals scores. This translates directly to better user engagement and SEO rankings.",
      "Start by converting your data-fetching components to Server Components. Use the 'use client' directive sparingly—only for components that need interactivity. Leverage Suspense boundaries to create smooth loading states and implement streaming for large data sets.",
      "Next.js 15 isn't just an incremental update—it's a new way of thinking about web development. By embracing these patterns early, you'll be well-positioned to build the next generation of high-performance web applications.",
    ],
  },
  {
    title: "Kubernetes in Production: Lessons Learned from Scaling to 1 Million Users",
    description: "Real-world insights and best practices for running Kubernetes at scale in production environments.",
    heroImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=630&fit=crop",
    readingTime: 15,
    categoryNames: ["DevOps", "Cloud Computing"],
    content: [
      "Scaling a Kubernetes cluster from a small proof-of-concept to handling millions of users is a journey filled with unexpected challenges. After two years of running K8s in production, we've accumulated hard-won knowledge about what works—and what doesn't.",
      "Resource management is where most teams struggle first. We learned to implement strict resource quotas per namespace, use Vertical Pod Autoscaler for right-sizing, and leverage Horizontal Pod Autoscaler with custom metrics beyond just CPU. Our pod density improved 3x after these optimizations.",
      "Observability becomes critical at scale. Without proper logging, metrics, and tracing, debugging production issues becomes nearly impossible. We standardized on the OpenTelemetry stack, implementing distributed tracing across all services. This reduced our mean time to resolution by 70%.",
      "Begin with a solid foundation: implement GitOps with ArgoCD or Flux, set up proper RBAC from day one, and invest in a service mesh like Istio or Linkerd. Create runbooks for common failure scenarios and practice chaos engineering to build resilience.",
      "Kubernetes at scale is not a destination but a continuous journey. The platform evolves rapidly, and so should your practices. Stay engaged with the community, contribute back when possible, and never stop learning.",
    ],
  },
  {
    title: "The Rise of Edge Computing: Why Latency Matters More Than Ever",
    description: "Understanding edge computing architecture and its impact on modern application performance.",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop",
    readingTime: 7,
    categoryNames: ["Cloud Computing", "Technology"],
    content: [
      "In an era where users expect instant responses, the laws of physics have become a critical constraint. Light can only travel so fast, and data centers halfway around the world will always have latency. Enter edge computing—bringing computation closer to users.",
      "Edge computing isn't just about speed; it's about enabling entirely new categories of applications. Real-time gaming, autonomous vehicles, augmented reality, and IoT applications all require sub-10ms latency that traditional cloud architecture simply cannot provide.",
      "The business case is compelling. Research shows that every 100ms of latency costs e-commerce sites 1% in sales. For gaming companies, high latency directly translates to player churn. Edge computing can reduce latency by 50-90% compared to centralized cloud deployments.",
      "Evaluate edge-first platforms like Cloudflare Workers, Vercel Edge Functions, or AWS Lambda@Edge. Start by moving static assets and simple API endpoints to the edge. Gradually migrate more complex logic as you understand the constraints and capabilities of edge environments.",
      "The future of computing is distributed. As 5G networks expand and IoT devices proliferate, edge computing will become the default architecture for latency-sensitive applications. The time to start building for the edge is now.",
    ],
  },
  {
    title: "TypeScript 5.4: New Features That Will Change How You Write Code",
    description: "A deep dive into the latest TypeScript features and how they improve developer productivity.",
    heroImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop",
    readingTime: 10,
    categoryNames: ["JavaScript", "Web Development"],
    content: [
      "TypeScript continues to evolve, and version 5.4 brings features that address long-standing pain points in the developer experience. From improved narrowing in closures to new utility types, this release is packed with practical improvements.",
      "The standout feature is narrowed type inference in closures. Previously, type narrowing didn't persist in callbacks, forcing developers to use type assertions. Now, TypeScript correctly preserves narrowed types, eliminating an entire class of workarounds and making code cleaner.",
      "For large codebases, the performance improvements in 5.4 are significant. The compiler is now 10-20% faster for incremental builds, and the language server provides snappier autocomplete and error checking. These might seem like small numbers, but they compound into a noticeably better development experience.",
      "Update your projects to TypeScript 5.4 and review the new strict mode options. Experiment with the NoInfer utility type for complex generic functions. Enable the new isolated declarations flag if you're building libraries to ensure your .d.ts files are self-contained.",
      "TypeScript's steady evolution reflects the JavaScript ecosystem's maturation. Each release makes type-safe JavaScript more accessible and more powerful. Stay current with TypeScript versions to leverage these improvements in your daily work.",
    ],
  },
  {
    title: "Securing Your APIs: A Practical Guide to Modern Authentication",
    description: "From JWT to OAuth 2.0, learn the best practices for securing your web APIs in 2024.",
    heroImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=630&fit=crop",
    readingTime: 11,
    categoryNames: ["Security", "Web Development"],
    content: [
      "API security has never been more critical. With the rise of microservices and third-party integrations, your APIs are often the most exposed part of your infrastructure. A single vulnerability can compromise entire systems and leak sensitive user data.",
      "Modern authentication goes beyond simple username/password schemes. OAuth 2.0 with PKCE is now the standard for third-party authorization, while JWTs provide stateless authentication that scales. However, these tools come with their own security considerations that many teams overlook.",
      "Common vulnerabilities persist: insecure token storage, missing rate limiting, inadequate input validation, and overly permissive CORS policies. The OWASP API Security Top 10 remains required reading for any team building APIs. Most breaches exploit these well-known issues rather than novel attack vectors.",
      "Implement defense in depth: use HTTPS everywhere, validate all inputs, implement proper rate limiting, and rotate secrets regularly. Consider API gateways for centralized security controls. Conduct regular security audits and penetration testing.",
      "Security is not a feature you add at the end—it's a mindset you cultivate from the start. Build security considerations into your development process, stay informed about emerging threats, and never assume your API is too small to be targeted.",
    ],
  },
  {
    title: "The Complete Guide to Database Optimization in PostgreSQL",
    description: "Master PostgreSQL performance tuning with practical tips for indexes, queries, and configuration.",
    heroImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop",
    readingTime: 14,
    categoryNames: ["Databases", "DevOps"],
    content: [
      "PostgreSQL is a powerful database, but poor optimization can turn it into a bottleneck. Whether you're dealing with slow queries, increasing latency, or preparing for scale, understanding how to tune Postgres is an essential skill for backend developers.",
      "Indexing strategy is often the biggest lever for performance. Beyond basic B-tree indexes, PostgreSQL offers GIN indexes for full-text search, GiST for geometric data, and BRIN for time-series workloads. Choosing the right index type can improve query performance by orders of magnitude.",
      "Query analysis using EXPLAIN ANALYZE reveals how PostgreSQL executes your queries. Look for sequential scans on large tables, nested loop joins with high row estimates, and sort operations spilling to disk. Each of these patterns suggests specific optimizations.",
      "Start with pg_stat_statements to identify your slowest and most frequent queries. Use connection pooling with PgBouncer to handle high connection counts. Configure work_mem, shared_buffers, and effective_cache_size based on your workload and available memory.",
      "Database optimization is iterative. Measure before and after every change, monitor in production, and be prepared to revisit your assumptions as your data grows. PostgreSQL rewards investment in understanding its internals with remarkable performance and reliability.",
    ],
  },
  {
    title: "Microservices vs Monoliths: Making the Right Architecture Choice",
    description: "A balanced look at when to choose microservices and when a monolith might be the better option.",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop",
    readingTime: 9,
    categoryNames: ["Software Architecture", "DevOps"],
    content: [
      "The microservices hype has led many teams to over-architect their systems prematurely. While microservices offer genuine benefits at scale, they also introduce complexity that can cripple smaller teams. The right architecture depends on your specific context.",
      "Microservices shine when you have multiple teams working independently, need to scale specific components differently, or require technology diversity. They struggle when team boundaries are unclear, deployment pipelines are immature, or observability tooling is lacking.",
      "The 'modular monolith' has emerged as a pragmatic middle ground. By enforcing clear module boundaries within a single deployment unit, you gain many benefits of microservices—independent development, clear interfaces—without the operational overhead of distributed systems.",
      "Start with a well-structured monolith. Define clear module boundaries based on business domains. Invest in automated testing and CI/CD. Only extract services when you have concrete evidence that the benefits outweigh the costs—usually when team coordination becomes the bottleneck.",
      "Architecture decisions are not permanent. Design for change by maintaining clean interfaces between components. Whether you're running a monolith or hundreds of microservices, the goal is the same: deliver value to users reliably and sustainably.",
    ],
  },
  {
    title: "React Performance Optimization: From Slow to Lightning Fast",
    description: "Practical techniques for identifying and fixing performance bottlenecks in React applications.",
    heroImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
    readingTime: 13,
    categoryNames: ["JavaScript", "Web Development"],
    content: [
      "React's virtual DOM reconciliation is efficient, but poorly structured applications can still suffer from sluggish performance. Understanding when and why React re-renders is the key to building fast applications that delight users.",
      "The React DevTools Profiler is your best friend for performance work. It visualizes the component tree, highlights re-renders, and measures commit times. Common culprits include unnecessary re-renders from unstable references, expensive computations on every render, and large component trees updating together.",
      "Memo, useMemo, and useCallback are powerful tools but easily misused. Profile before optimizing—premature memoization adds complexity without benefits. When you do memoize, ensure your dependency arrays are correct; stale closures are a common source of bugs.",
      "Implement code splitting with React.lazy and Suspense to reduce initial bundle size. Use virtualization libraries like react-window for long lists. Consider moving expensive computations to Web Workers. Leverage React 18's concurrent features for smoother updates.",
      "Performance optimization is a practice, not a destination. Build performance budgets into your development process, automate lighthouse checks in CI, and address regressions early. The best performing code is often the simplest—optimize for clarity first, then profile and improve.",
    ],
  },
  {
    title: "Introduction to WebAssembly: Running Native Code in the Browser",
    description: "Learn how WebAssembly enables high-performance applications in web browsers and beyond.",
    heroImage: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop",
    readingTime: 10,
    categoryNames: ["Web Development", "Technology"],
    content: [
      "WebAssembly (Wasm) brings near-native performance to the web, enabling applications that were previously impossible in browsers. From video editing to 3D games, CAD software to machine learning inference, Wasm is expanding what's possible on the web platform.",
      "Unlike JavaScript, WebAssembly is a low-level binary format designed for efficient execution. Code written in languages like Rust, C++, or Go can be compiled to Wasm and run in any modern browser. This opens the door to reusing existing native codebases on the web.",
      "The performance benefits are substantial—Wasm code typically runs within 10-20% of native speed. But Wasm's value extends beyond raw performance. It provides a sandboxed execution environment, deterministic behavior across platforms, and a growing ecosystem of tools and libraries.",
      "Start by exploring the Emscripten toolchain for C/C++ or wasm-pack for Rust. Identify computationally intensive parts of your application—image processing, data compression, simulations—that could benefit from Wasm. Begin with isolated modules before attempting larger migrations.",
      "WebAssembly's influence is spreading beyond browsers. WASI (WebAssembly System Interface) enables Wasm modules to run server-side with capabilities like file system access. The vision of 'compile once, run anywhere' is finally becoming reality.",
    ],
  },
  {
    title: "Building Real-Time Applications with WebSockets and Server-Sent Events",
    description: "A practical comparison of real-time web technologies and when to use each approach.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
    readingTime: 8,
    categoryNames: ["Web Development", "JavaScript"],
    content: [
      "Real-time features have become table stakes for modern web applications. Chat, notifications, live updates, collaborative editing—users expect instant feedback. Choosing the right real-time technology is crucial for both user experience and infrastructure costs.",
      "WebSockets provide full-duplex communication, ideal for bidirectional data flow like chat applications or multiplayer games. Server-Sent Events (SSE) offer a simpler, unidirectional alternative perfect for live feeds and notifications. Long-polling remains viable for environments where WebSockets are blocked.",
      "Infrastructure considerations differ significantly. WebSockets require sticky sessions or a pub/sub layer for horizontal scaling. SSE works better with HTTP/2 multiplexing and existing load balancers. Consider your deployment environment and operational capabilities when choosing.",
      "For WebSockets, explore libraries like Socket.io for ease of use or ws for minimal overhead. For SSE, the native EventSource API is sufficient for most use cases. Implement proper reconnection logic, heartbeats for connection health, and graceful degradation for unreliable networks.",
      "Real-time features introduce complexity—connection management, state synchronization, conflict resolution. Start simple, measure actual requirements, and scale your solution accordingly. Often, polling at short intervals provides 'real-time enough' behavior with far less complexity.",
    ],
  },
  {
    title: "Git Workflow Strategies for High-Performing Teams",
    description: "From GitFlow to trunk-based development: choosing and implementing the right workflow for your team.",
    heroImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=630&fit=crop",
    readingTime: 7,
    categoryNames: ["DevOps", "Software Architecture"],
    content: [
      "Your Git workflow shapes how your team collaborates, how quickly you can ship, and how confidently you can deploy. The wrong workflow creates friction; the right one becomes invisible, letting developers focus on building features rather than managing branches.",
      "GitFlow, once the gold standard, is falling out of favor for teams practicing continuous delivery. Its long-lived branches and complex merging ceremonies slow down iteration. Trunk-based development, where all developers commit to a single main branch, enables faster feedback and simpler releases.",
      "The key insight is that branching strategies should match your deployment capabilities. If you can deploy multiple times daily with feature flags, trunk-based development makes sense. If releases are infrequent and require coordination, a more structured approach might be necessary.",
      "Implement branch protection rules requiring code review and passing CI. Keep feature branches short-lived—ideally under a day. Use semantic commit messages and consider conventional commits for automated changelog generation. Automate as much of your workflow as possible.",
      "The best workflow is one your team actually follows. Start with something simple, measure cycle time and deployment frequency, and iterate. Remember that processes exist to serve people, not the other way around.",
    ],
  },
];

// Tech categories
const techCategories = [
  { name: "AI & Machine Learning", slug: "ai-machine-learning", description: "Artificial Intelligence and Machine Learning topics" },
  { name: "Web Development", slug: "web-development", description: "Frontend and full-stack web development" },
  { name: "JavaScript", slug: "javascript", description: "JavaScript, TypeScript, and related frameworks" },
  { name: "DevOps", slug: "devops", description: "DevOps practices, CI/CD, and infrastructure" },
  { name: "Cloud Computing", slug: "cloud-computing", description: "Cloud platforms and services" },
  { name: "Security", slug: "security", description: "Application and infrastructure security" },
  { name: "Databases", slug: "databases", description: "Database systems and optimization" },
  { name: "Software Architecture", slug: "software-architecture", description: "System design and architecture patterns" },
  { name: "Technology", slug: "technology", description: "General technology topics and trends" },
];

async function ensureSeedUser() {
  const id = "seed_user";
  const email = "seed@example.com";
  const name = "Tech Writer";
  const existing = await db.query.user
    .findFirst({ where: eq(user.id, id) })
    .catch(() => null);
  if (existing) return existing.id;
  await db.insert(user).values({ id, email, name, emailVerified: true });
  return id;
}

async function clearExistingData() {
  console.log("Clearing existing blog posts...");
  await db.delete(postCategories).execute();
  await db.delete(blogPosts).execute();
  await db.delete(categories).execute();
  console.log("Existing data cleared.");
}

async function ensureCategories() {
  console.log("Creating tech categories...");
  for (const c of techCategories) {
    const found = await db.query.categories
      .findFirst({ where: eq(categories.slug, c.slug) })
      .catch(() => null);
    if (!found) {
      await db.insert(categories).values(c);
    }
  }
  const rows = await db.select().from(categories);
  console.log(`Created ${rows.length} categories.`);
  return rows;
}

async function createTechPosts(authorId: string) {
  const cats = await ensureCategories();
  console.log("Creating tech blog posts...");

  for (const post of techBlogPosts) {
    const slug = slugify(post.title);
    const postCategories = cats.filter((c) =>
      post.categoryNames.includes(c.name)
    );

    const content = createBlogContent(post.title, post.content);

    const [created] = await db
      .insert(blogPosts)
      .values({
        title: post.title,
        slug,
        content: content as unknown as object,
        heroImage: post.heroImage,
        description: post.description,
        status: "PUBLISHED",
        published: true,
        authorId,
        authorName: "Tech Writer",
        readingTime: post.readingTime,
        categories: postCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })) as any,
      })
      .onConflictDoNothing()
      .returning();

    if (created) {
      console.log(`  Created: ${post.title.substring(0, 50)}...`);
    }
  }
}

async function main() {
  console.log("Starting tech blog seed...\n");

  // Clear existing data
  await clearExistingData();

  // Create seed user
  const authorId = await ensureSeedUser();
  console.log("Seed user ready.\n");

  // Create tech posts
  await createTechPosts(authorId);

  console.log("\nSeed completed successfully!");
  console.log(`Created ${techBlogPosts.length} tech blog posts.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
