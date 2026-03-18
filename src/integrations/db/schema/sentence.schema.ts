import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "../_core";
import { user } from "./auth.schema";

/** 사용자가 기록한 문장 */
export const sentences = pgTable("sentences", {
  id: cuidPrimaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
