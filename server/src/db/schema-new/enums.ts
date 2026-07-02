import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "TEACHER", "STUDENT"]);
export const statusEnum = pgEnum("status", [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "DELETED",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "OVERDUE",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
]);
