import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/database-pool";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },
  plugins: [admin()],
});
