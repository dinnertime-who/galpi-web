"use server";

import { count, desc, eq, lt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis, sentences, sources, user } from "@/integrations/db/schema";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

const getAllGalpisActionRequest = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().positive().default(10),
});
export type GetAllGalpisActionRequest = z.infer<typeof getAllGalpisActionRequest>;

export async function getAllGalpisAction(input: GetAllGalpisActionRequest = { limit: 10 }) {
  const { data, error } = validateRequest(getAllGalpisActionRequest, input);
  if (error) return { error: error.message };

  const { cursor, limit } = data;

  const { data: rows, error: dbError } = await tryCatch(async () => {
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
        authorId: user.id,
        authorName: user.name,
        authorImage: user.image,
      })
      .from(sentences)
      .leftJoin(sources, eq(sentences.sourceId, sources.id))
      .leftJoin(galpis, eq(galpis.sentenceId, sentences.id))
      .leftJoin(user, eq(user.id, sentences.userId))
      .where(cursor ? lt(sentences.createdAt, new Date(cursor)) : undefined)
      .orderBy(desc(sentences.createdAt))
      .limit(limit + 1);
  });

  if (dbError) return { error: "문장 목록을 불러오는 중 오류가 발생했습니다." };

  let total: number | undefined;
  if (!cursor) {
    const { data: countResult, error: countError } = await tryCatch(async () => {
      return db.select({ total: count() }).from(sentences);
    });
    if (!countError && countResult) {
      total = countResult[0].total;
    }
  }

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? (items[items.length - 1].sentenceCreatedAt?.toISOString() ?? null) : null;

  return {
    result: {
      items: items.map((row) => ({
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
        galpi: row.galpiId
          ? {
              id: row.galpiId,
              note: row.galpiNote
                ? row.galpiNote.length > 50
                  ? `${row.galpiNote.slice(0, 50)}...`
                  : row.galpiNote
                : undefined,
            }
          : null,
        author: row.authorId
          ? {
              id: row.authorId,
              name: row.authorName,
              image: row.authorImage ?? undefined,
            }
          : null,
      })),
      nextCursor,
      total,
    },
  };
}
