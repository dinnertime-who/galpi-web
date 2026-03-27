"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis, sentences, sources, userSources } from "@/integrations/db/schema";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

const sourceSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  subTitle: z.string().optional(),
  page: z.number().int().positive().optional(),
  isbn: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
  pubdate: z.string().optional(),
  publisher: z.string().optional(),
});

const saveGalpiActionRequest = z.object({
  text: z.string().min(1, "기록할 문장을 입력해주세요.").max(100, "문장은 최대 100자까지 입력할 수 있습니다."),
  note: z.string().optional(),
  source: sourceSchema.optional(),
});
export type SaveGalpiActionRequest = z.infer<typeof saveGalpiActionRequest>;

export async function saveGalpiAction(input: SaveGalpiActionRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "인증이 필요합니다." };

  const { data, error } = validateRequest(saveGalpiActionRequest, input);
  if (error) return { error: error.message };

  const { data: result, error: transactionError } = await tryCatch(async () => {
    const { text, note, source } = data;

    const result = await db.transaction(async (tx) => {
      let sourceId: string | undefined;

      if (source) {
        // isbn이 있으면 기존 source 재사용, 없으면 새로 생성
        let existingSource = null;
        if (source.isbn) {
          existingSource = await tx.query.sources.findFirst({
            where: eq(sources.isbn, source.isbn),
          });
        }

        if (existingSource) {
          sourceId = existingSource.id;
        } else {
          const [saved] = await tx.insert(sources).values(source).returning();
          sourceId = saved.id;
        }

        // user ↔ source 연결 (이미 연결돼 있으면 무시)
        await tx
          .insert(userSources)
          .values({ userId: session.user.id, sourceId })
          .onConflictDoNothing();
      }

      const [sentence] = await tx.insert(sentences).values({ userId: session.user.id, sourceId, text }).returning();

      const [galpi] = await tx
        .insert(galpis)
        .values({ userId: session.user.id, sentenceId: sentence.id, note })
        .returning();

      return galpi;
    });

    return result;
  });

  if (transactionError) return { error: transactionError.message };

  return { result };
}
