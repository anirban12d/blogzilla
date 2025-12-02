import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { getBaseUrl } from "@/lib/utils";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [nextCookies(), adminClient()],
});
