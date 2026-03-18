import { z } from "zod";

const EnvSchema = z.object({
  GEMINI_API_KEY: z.string(),
  DATABASE_URL: z.string().url(),
});

export const env = EnvSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
});
export type Env = z.infer<typeof EnvSchema>;
