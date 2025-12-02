import { AuthView } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { QuotesCarousel } from "@/components/auth/quotes-carousel";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="grid h-screen w-screen grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div className="hidden md:block h-full bg-zinc-900 text-white">
        <QuotesCarousel />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center p-8 bg-background">
        <div className="absolute top-4 left-8 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/blogzilla.png"
            alt="Blogzilla Logo"
            className="h-12 w-auto"
          />
        </div>
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to Blogzilla
            </h1>
            <p className="text-muted-foreground">
              Your personal space for thoughts, ideas, and stories. <br />
              Join our community of writers and readers today.
            </p>
          </div>
          <AuthView path={path} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
