import { env } from "@/config/env";

import "server-only";
import { GoogleGenAI } from "@google/genai";

export const genAi = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
