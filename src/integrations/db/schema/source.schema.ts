import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "../_core";
import { user } from "./auth.schema";

/** 문장의 출처 (책, 아티클 등) */
export const sources = pgTable("sources", {
  id: cuidPrimaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  subTitle: text("sub_title"),
  page: integer("page"),
  isbn: text("isbn"),
  url: text("url"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
