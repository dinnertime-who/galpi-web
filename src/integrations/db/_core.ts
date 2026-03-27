import { ulid } from "ulid";
import { text, timestamp } from "drizzle-orm/pg-core";

export const ulidPrimaryKey = () =>
  text("id")
    .$defaultFn(() => ulid())
    .primaryKey();

export const createdAt = () => timestamp("created_at").defaultNow().notNull();

export const updatedAt = () =>
  timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date());

export const deletedAt = () => timestamp("deleted_at");
