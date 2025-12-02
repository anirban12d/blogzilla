import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../init";
import { categoriesRouter } from "./categories";
import { postsRouter } from "./posts";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ ok: true })),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => ({ greeting: `hello ${opts.input.text}` })),
  categories: categoriesRouter,
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
