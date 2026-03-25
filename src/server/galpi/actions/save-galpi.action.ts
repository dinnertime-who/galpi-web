"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis, sentences } from "@/integrations/db/schema";
import { auth } from "@/lib/auth";

export const SaveGalpiActionRequest = z.object({
  text: z.string().min(1, "기록할 문장을 입력해주세요."),
  note: z.string().optional(),
});

export async function saveGalpiAction(input: z.infer<typeof SaveGalpiActionRequest>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "인증이 필요합니다." };

  try {
    const result = await db.transaction(async (tx) => {
      const [sentence] = await tx.insert(sentences).values({ userId: session.user.id, text: input.text }).returning();

      const [galpi] = await tx
        .insert(galpis)
        .values({
          userId: session.user.id,
          sentenceId: sentence.id,
          note: input.note,
        })
        .returning();

      return galpi;
    });

    return { result };
  } catch (e) {
    console.error(e);
    return { error: "저장에 실패했습니다." };
  }
}
