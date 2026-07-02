import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { taskStatusEnum, taskPriorityEnum } from "./enums";

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("PENDING"),
    priority: taskPriorityEnum("priority"),
    dueDate: timestamp("due_date"),
    createdById: integer("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    assignedToId: integer("assigned_to_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("tasks_created_by_idx").on(table.createdById),
    index("tasks_assigned_to_idx").on(table.assignedToId),
    index("tasks_status_idx").on(table.status),
  ],
);
