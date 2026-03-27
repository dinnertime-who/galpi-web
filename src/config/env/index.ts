import { z } from "zod";

const EnvSchema = z.object({
  GEMINI_API_KEY: z.string(),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  SITE_URL: z.url(),

  NAVER_API_CLIENT_ID: z.string(),
  NAVER_API_CLIENT_SECRET: z.string(),
});

export const env = EnvSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,

  NAVER_API_CLIENT_ID: process.env.NAVER_API_CLIENT_ID,
  NAVER_API_CLIENT_SECRET: process.env.NAVER_API_CLIENT_SECRET,
});
export type Env = z.infer<typeof EnvSchema>;
