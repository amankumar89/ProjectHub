import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { taskStatusEnum, taskPriorityEnum } from "./enums.schema";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("TODO").notNull(),
  priority: taskPriorityEnum("priority").default("MEDIUM").notNull(),
  dueDate: date("due_date"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdBy: integer("created_by")
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

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
