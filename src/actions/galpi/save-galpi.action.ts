"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis, sentences } from "@/integrations/db/schema";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

export const SaveGalpiActionRequest = z.object({
  text: z.string().min(1, "기록할 문장을 입력해주세요."),
  note: z.string().optional(),
});

export async function saveGalpiAction(input: z.infer<typeof SaveGalpiActionRequest>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "인증이 필요합니다." };

  const { data, error } = validateRequest(SaveGalpiActionRequest, input);
  if (error) return { error: error.message };

  const { data: result, error: transactionError } = await tryCatch(async () => {
    const { text, note } = data;

    const result = await db.transaction(async (tx) => {
      const [sentence] = await tx.insert(sentences).values({ userId: session.user.id, text }).returning();

      const [galpi] = await tx
        .insert(galpis)
        .values({
          userId: session.user.id,
          sentenceId: sentence.id,
          note,
        })
        .returning();

      return galpi;
    });

    return result;
  });

  if (transactionError) return { error: transactionError.message };

  return { result };
}
