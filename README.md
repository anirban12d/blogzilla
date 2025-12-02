# Blogzilla

Blogzilla is a modern, full-featured blogging platform built with the latest web technologies. It offers a seamless writing experience, robust content management, and a beautiful, responsive design.

![Blogzilla](/blogzilla.png)

## 🚀 Features

-   **Rich Text Editor**: Powered by [Novel](https://novel.sh/), offering a Notion-style editing experience with slash commands and AI autocomplete.
-   **Authentication**: Secure and flexible authentication using [Better Auth](https://better-auth.com/).
-   **Dashboard**: Comprehensive dashboard for managing posts (drafts & published), categories, and user settings.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS and Shadcn UI, looking great on all devices.
-   **Dark Mode**: Built-in dark mode support for comfortable reading and writing at night.
-   **SEO Optimized**: Server-side rendering and optimized metadata for better search engine visibility.
-   **Type-Safe API**: End-to-end type safety with tRPC.
-   **AI Integration**: Integrated AI tools for content generation and improvement.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Authentication**: [Better Auth](https://better-auth.com/)
-   **API**: [tRPC](https://trpc.io/)
-   **Editor**: [Novel](https://novel.sh/)
-   **AI**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
-   **File Uploads**: [UploadThing](https://uploadthing.com/)
-   **Package Manager**: [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm

## 🏁 Getting Started

### Prerequisites

-   Node.js 18+ or Bun
-   PostgreSQL database (local or cloud like Neon)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/blogzilla.git
    cd blogzilla
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    # or
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://..."

    # Authentication (Better Auth)
    BETTER_AUTH_SECRET="your-secret-here"
    NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000" # or your production URL
    
    # AI (Optional, for AI features)
    OPENAI_API_KEY="sk-..."

    # UploadThing (for image uploads)
    UPLOADTHING_SECRET="sk_live_..."
    UPLOADTHING_APP_ID="..."
    ```

4.  **Push database schema:**

    ```bash
    bun run db:push
    # or check package.json for specific drizzle command
    npx drizzle-kit push
    ```

5.  **Run the development server:**

    ```bash
    bun dev
    # or
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

-   `dev`: Run the development server.
-   `build`: Build the application for production.
-   `start`: Start the production server.
-   `lint`: Run Biome check.
-   `format`: Run Biome format.
-   `seed`: Seed the database with dummy data.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
