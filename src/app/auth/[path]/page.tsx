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
    <main className="grid h-screen w-screen grid-cols-1 lg:grid-cols-2 overflow-hidden">
      <div className="hidden lg:block h-full">
        <QuotesCarousel />
      </div>
      <div className="relative flex h-full flex-col items-center justify-center p-6 md:p-10 bg-background">
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/blogzilla.png"
            alt="Blogzilla Logo"
            className="h-10 w-auto"
          />
        </div>
        <div className="w-full max-w-[380px] space-y-8">
          <div className="flex flex-col space-y-3 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal space for thoughts, ideas, and stories.
            </p>
          </div>
          <AuthView path={path} />
          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-foreground/80 underline underline-offset-4 hover:text-primary transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-foreground/80 underline underline-offset-4 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
