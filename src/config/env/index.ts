import { z } from "zod";

const EnvSchema = z.object({
  GEMINI_API_KEY: z.string(),
});

export const env = EnvSchema.parse({
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
});
export type Env = z.infer<typeof EnvSchema>;
