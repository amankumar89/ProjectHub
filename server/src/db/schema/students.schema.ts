import {
  pgTable,
  serial,
  varchar,
  date,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 20 }).notNull().unique(), // e.g. STU-2025-001
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  enrolledAt: date("enrolled_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  addedBy: integer("added_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
