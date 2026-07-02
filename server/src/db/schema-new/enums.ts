import { pgEnum } from "drizzle-orm/pg-core";

const userRoles = ["USER", "ADMIN", "TEACHER", "STUDENT"] as const;
const userStatus = ["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"] as const;
const taskStatus = ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"] as const;
const taskPriority = ["LOW", "MEDIUM", "HIGH"] as const;

export const roleEnum = pgEnum("role", userRoles);
export const statusEnum = pgEnum("status", userStatus);
export const taskStatusEnum = pgEnum("task_status", taskStatus);
export const taskPriorityEnum = pgEnum("task_priority", taskPriority);

export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatus)[number];
export type TaskStatus = (typeof taskStatus)[number];
export type TaskPriority = (typeof taskPriority)[number];
