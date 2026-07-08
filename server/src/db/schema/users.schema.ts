import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { roleEnum, statusEnum } from "./enums.schema";
import { text } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("USER").notNull(),
  status: statusEnum("status").default("ACTIVE").notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }), // for soft delete
  refreshToken: text("refresh_token"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
