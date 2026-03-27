import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createdAt } from "../_core";
import { user } from "./auth.schema";
import { sources } from "./source.schema";

/** users ↔ sources N:N 중간 테이블 */
export const userSources = pgTable(
  "user_sources",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sourceId: text("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.sourceId] })],
);
