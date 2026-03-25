"use server";

import { and, desc, eq, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/integrations/db";
import { galpis, sentences, sources } from "@/integrations/db/schema";
import { auth } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { validateRequest } from "../utils";

const getMyGalpisActionRequest = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().positive().default(10),
});
export type GetMyGalpisActionRequest = z.infer<typeof getMyGalpisActionRequest>;

export async function getMyGalpisAction(input: GetMyGalpisActionRequest = { limit: 10 }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "인증이 필요합니다." };

  const { data, error } = validateRequest(getMyGalpisActionRequest, input);
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
      })
      .from(sentences)
      .leftJoin(sources, eq(sentences.sourceId, sources.id))
      .leftJoin(galpis, eq(galpis.sentenceId, sentences.id))
      .where(and(eq(sentences.userId, session.user.id), cursor ? lt(sentences.createdAt, new Date(cursor)) : undefined))
      .orderBy(desc(sentences.createdAt))
      .limit(limit + 1);
  });

  if (dbError) return { error: "문장 목록을 불러오는 중 오류가 발생했습니다." };

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
      })),
      nextCursor,
    },
  };
}
