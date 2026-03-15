"use server";

import { revalidatePath } from "next/cache";
import { createQuote as dbCreate } from "@/lib/quotes";
import type { Quote } from "@/lib/quotes";

export async function saveQuote(
  text: string,
  source?: string,
): Promise<Quote> {
  const quote = dbCreate(text, source);
  revalidatePath("/");
  return quote;
}
