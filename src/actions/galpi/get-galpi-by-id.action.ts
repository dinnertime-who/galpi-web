"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis, sentences, sources, user } from "@/integrations/db/schema";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

const getGalpiByIdActionRequest = z.object({
  id: z.string().min(1),
});
export type GetGalpiByIdActionRequest = z.infer<typeof getGalpiByIdActionRequest>;

export async function getGalpiByIdAction(input: GetGalpiByIdActionRequest) {
  const { data, error } = validateRequest(getGalpiByIdActionRequest, input);
  if (error) return { error: error.message };

  const { data: rows, error: dbError } = await tryCatch(async () => {
    return db
      .select({
        galpiId: galpis.id,
        galpiNote: galpis.note,
        sentenceId: sentences.id,
        sentenceText: sentences.text,
        sentenceCreatedAt: sentences.createdAt,
        sourceTitle: sources.title,
        sourceAuthor: sources.author,
        sourceSubTitle: sources.subTitle,
        sourcePage: sources.page,
        authorId: user.id,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(galpis)
      .innerJoin(sentences, eq(galpis.sentenceId, sentences.id))
      .leftJoin(sources, eq(sentences.sourceId, sources.id))
      .innerJoin(user, eq(galpis.userId, user.id))
      .where(eq(galpis.id, data.id))
      .limit(1);
  });

  if (dbError) return { error: "갈피를 불러오는 중 오류가 발생했습니다." };

  const row = rows?.[0];
  if (!row) return { error: "갈피를 찾을 수 없습니다." };

  return {
    result: {
      galpi: {
        id: row.galpiId,
        note: row.galpiNote ?? undefined,
      },
      sentence: {
        id: row.sentenceId,
        text: row.sentenceText,
        createdAt: row.sentenceCreatedAt,
      },
      source:
        row.sourceTitle && row.sourceAuthor
          ? {
              title: row.sourceTitle,
              author: row.sourceAuthor,
              subTitle: row.sourceSubTitle ?? undefined,
              page: row.sourcePage ?? undefined,
            }
          : null,
      author: {
        id: row.authorId,
        name: row.authorName,
        image: row.authorImage ?? undefined,
      },
    },
  };
}
