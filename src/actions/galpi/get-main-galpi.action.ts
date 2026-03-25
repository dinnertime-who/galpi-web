"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/integrations/db";
import { galpis, sentences, sources, user } from "@/integrations/db/schema";
import { tryCatch } from "@/lib/try-catch";

export async function getMainGalpiAction() {
  const { data: rows, error } = await tryCatch(async () => {
    return db
      .select({
        sentenceId: sentences.id,
        sentenceText: sentences.text,
        sentenceCreatedAt: sentences.createdAt,
        sourceTitle: sources.title,
        sourceAuthor: sources.author,
        sourceSubTitle: sources.subTitle,
        sourcePage: sources.page,
        galpiId: galpis.id,
        galpiNote: galpis.note,
        galpiCreatedAt: galpis.createdAt,
        authorId: user.id,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(sentences)
      .leftJoin(sources, eq(sentences.sourceId, sources.id))
      .leftJoin(galpis, eq(galpis.sentenceId, sentences.id))
      .leftJoin(user, eq(user.id, galpis.userId))
      .orderBy(desc(sentences.createdAt))
      .limit(1);
  });

  if (error) return { error: "갈피를 불러오는 중 오류가 발생했습니다." };

  const row = rows?.[0];
  if (!row) return { result: null };

  return {
    result: {
      sentence: {
        id: row.sentenceId,
        text: row.sentenceText,
        createdAt: row.sentenceCreatedAt,
      },
      source: row.sourceTitle
        ? {
            title: row.sourceTitle,
            author: row.sourceAuthor,
            subTitle: row.sourceSubTitle ?? undefined,
            page: row.sourcePage ?? undefined,
          }
        : null,
      galpi: row.galpiId
        ? {
            id: row.galpiId,
            note: row.galpiNote ?? undefined,
            createdAt: row.galpiCreatedAt,
          }
        : null,
      author: row.authorId
        ? {
            id: row.authorId,
            name: row.authorName,
            image: row.authorImage ?? undefined,
          }
        : null,
    },
  };
}
