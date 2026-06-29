import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  pgEnum,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const roles = ["USER", "ADMIN", "TEACHER", "STUDENT"] as const;
export const userRoleEnum = pgEnum("user_role", roles);
export type UserRole = (typeof roles)[number];

export const status = ["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"] as const;
export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "DELETED",
]);
export type UserStatus = (typeof status)[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("USER").notNull(),
  status: userStatusEnum("status").default("ACTIVE").notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`now()`)
    .notNull(),
  deletedAt: timestamp("deleted_at"), // for soft delete
  refreshToken: varchar("refresh_token"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Partial<
  Pick<User, "name" | "email" | "password" | "role" | "status" | "lastLogin">
>;
