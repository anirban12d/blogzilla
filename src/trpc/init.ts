import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth/auth";
// import superjson from "superjson";

type CreateContextParams = {
  req: Request;
  resHeaders: Headers;
};

export const createTRPCContext = async (opts: CreateContextParams) => {
  const session = await auth.api.getSession({ headers: opts.req.headers });
  return {
    session,
    userId: session?.user.id ?? null,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
};

const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    // transformer: superjson,
  });

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
