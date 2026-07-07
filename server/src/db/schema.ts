// import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  unique,
  index,
  boolean,
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

// STUDENTS
export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    fullName: varchar("full_name").notNull(),
    rollNumber: varchar("roll_number").notNull(),
    grade: varchar("grade"),
    section: varchar("section"),
    guardianName: varchar("guardian_name"),
    guardianContact: varchar("guardian_contact"),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    createdBy: integer("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    status: userStatusEnum("status").default("ACTIVE").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    unique("students_roll_number_unique").on(table.rollNumber),
    index("students_user_id_idx").on(table.userId),
    index("students_created_by_idx").on(table.createdBy),
  ],
);

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

// // NOTES
// export const notes = pgTable(
//   "notes",
//   {
//     id: serial("id").primaryKey(),
//     title: varchar("title").notNull(),
//     content: text("content").notNull(),
//     createdBy: integer("created_by")
//       .notNull()
//       .references(() => users.id, { onDelete: "set null" }),
//     assignedTo: integer("assigned_to").references(() => users.id, {
//       onDelete: "set null",
//     }),
//     isPrivate: boolean("is_private").default(true).notNull(),
//     createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
//       .defaultNow()
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
//       .defaultNow()
//       .$onUpdate(() => new Date())
//       .notNull(),
//     deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
//   },
//   (table) => [
//     index("notes_created_by_idx").on(table.createdBy),
//     index("notes_assigned_to_idx").on(table.assignedTo),
//   ],
// );

// export type Note = typeof notes.$inferSelect;
// export type NewNote = typeof notes.$inferInsert;

// // TASKS
// export const taskPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
// export const taskPriorityEnum = pgEnum("task_priority", taskPriority);
// export type TaskPriority = (typeof taskPriority)[number];

// export const taskStatusValues = [
//   "TODO",
//   "IN_PROGRESS",
//   "DONE",
//   "CANCELLED",
// ] as const;
// export const taskStatusEnum = pgEnum("task_status", taskStatusValues);
// export type TaskStatusType = (typeof taskStatusValues)[number];

// export const tasks = pgTable(
//   "tasks",
//   {
//     id: serial("id").primaryKey(),
//     title: varchar("title").notNull(),
//     description: text("description"),
//     createdBy: integer("created_by")
//       .notNull()
//       .references(() => users.id, { onDelete: "set null" }),
//     assignedTo: integer("assigned_to").references(() => users.id, {
//       onDelete: "set null",
//     }),
//     priority: taskPriorityEnum("priority").default("MEDIUM").notNull(),
//     taskStatus: taskStatusEnum("task_status").default("TODO").notNull(),
//     dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }),
//     completedAt: timestamp("completed_at", {
//       withTimezone: true,
//       mode: "date",
//     }),
//     createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
//       .defaultNow()
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
//       .defaultNow()
//       .$onUpdate(() => new Date())
//       .notNull(),
//     deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
//   },
//   (table) => [
//     index("tasks_created_by_idx").on(table.createdBy),
//     index("tasks_assigned_to_idx").on(table.assignedTo),
//     index("tasks_status_idx").on(table.taskStatus),
//   ],
// );

// export type Task = typeof tasks.$inferSelect;
// export type NewTask = typeof tasks.$inferInsert;
