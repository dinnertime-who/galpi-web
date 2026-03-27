import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createdAt, ulidPrimaryKey, updatedAt } from "../_core";

/** better-auth: 사용자 */
export const user = pgTable("user", {
  id: ulidPrimaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/** better-auth: 세션 */
export const session = pgTable("session", {
  id: ulidPrimaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/** better-auth: OAuth 계정 연결 */
export const account = pgTable("account", {
  id: ulidPrimaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/** better-auth: 이메일 인증 토큰 */
export const verification = pgTable("verification", {
  id: ulidPrimaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
