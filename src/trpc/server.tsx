import "server-only"; // <-- ensure this file cannot be imported from the client

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { createTRPCClient } from "@trpc/client";
import { httpLink } from "@trpc/client";
import { makeQueryClient } from "./query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: async () => {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    return { session, userId: session?.user.id ?? null, req: undefined as any, resHeaders: undefined as any };
  },
  router: appRouter,
  queryClient: getQueryClient,
});

createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: "..." })],
  }),
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
