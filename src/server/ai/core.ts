import "server-only";
import { env } from "@/config/env";
import { GoogleGenAI } from "@google/genai";

export const genAi = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
