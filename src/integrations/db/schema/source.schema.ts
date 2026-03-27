import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, ulidPrimaryKey, updatedAt } from "../_core";

/** 문장의 출처 (책, 아티클 등) — users와 N:N (user_sources 경유) */
export const sources = pgTable("sources", {
  id: ulidPrimaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  subTitle: text("sub_title"),
  page: integer("page"),
  isbn: text("isbn").unique(),
  url: text("url"),
  image: text("image"),
  publisher: text("publisher"),
  pubdate: text("pubdate"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
