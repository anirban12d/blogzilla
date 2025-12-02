"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header/header";
import { TRPCReactProvider } from "@/trpc/trpc-provider";
import { authClient } from "@/lib/auth/auth-client";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();

  const isDashboardPage = pathName.startsWith("/dashboard");
  const isAuthPage = pathName.startsWith("/auth");
  const shouldHideSidebar = isDashboardPage || isAuthPage;

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh();
      }}
      Link={Link}
    >
      <TRPCReactProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!shouldHideSidebar && <Header />}
          {children}
          <Toaster richColors={true} position={"top-center"} />
        </ThemeProvider>
      </TRPCReactProvider>
    </AuthUIProvider>
  );
}
