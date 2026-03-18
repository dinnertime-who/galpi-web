import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "../_core";
import { user } from "./auth.schema";
import { sentences } from "./sentence.schema";

/** 문장에 대한 갈피 (메모) */
export const galpis = pgTable("galpis", {
  id: cuidPrimaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sentenceId: text("sentence_id")
    .notNull()
    .references(() => sentences.id, { onDelete: "cascade" }),
  note: text("note"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
