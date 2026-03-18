"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/integrations/db";
import { galpis, sentences } from "@/integrations/db/schema";
import { auth } from "@/lib/auth";

export async function getLatestGalpiAction() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { result: null };

  try {
    const [row] = await db
      .select({ text: sentences.text, note: galpis.note })
      .from(galpis)
      .innerJoin(sentences, eq(galpis.sentenceId, sentences.id))
      .where(eq(galpis.userId, session.user.id))
      .orderBy(desc(galpis.createdAt))
      .limit(1);

    return { result: row ?? null };
  } catch (e) {
    console.error(e);
    return { result: null };
  }
}
