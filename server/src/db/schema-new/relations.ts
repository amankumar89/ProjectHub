// schema/relations.ts
import { relations } from "drizzle-orm";
import { users } from "./users";
import { students } from "./students";
import { tasks } from "./tasks";
import { notes } from "./notes";
import { refreshTokens } from "./refresh-token";

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  createdTasks: many(tasks, { relationName: "taskCreator" }),
  assignedTasks: many(tasks, { relationName: "taskAssignee" }),
  notes: many(notes),
  refreshTokens: many(refreshTokens),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  notes: many(notes),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  creator: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "taskCreator",
  }),
  assignee: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
    relationName: "taskAssignee",
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  author: one(users, {
    fields: [notes.authorId],
    references: [users.id],
  }),
  student: one(students, {
    fields: [notes.studentId],
    references: [students.id],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));
