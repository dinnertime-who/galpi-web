import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/integrations/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
