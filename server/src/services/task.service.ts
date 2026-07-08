import { count, desc, eq, or } from "drizzle-orm";
import { tasks } from "../db/schema";
import { users } from "../db/schema";
import { buildPagination, Paginated } from "../utils/helper";
import type { NewTask, Task } from "../db/schema";
import { db } from "../db";

const STATUS_ORDER = ["TODO", "IN_PROGRESS", "DONE"] as const;

function isValidStatusTransition(from: string, to: string) {
  if (from === to) return true;
  const fromIdx = STATUS_ORDER.indexOf(from as (typeof STATUS_ORDER)[number]);
  const toIdx = STATUS_ORDER.indexOf(to as (typeof STATUS_ORDER)[number]);
  return toIdx === fromIdx + 1;
}

function canModifyTask(
  task: { createdBy: number; assignedTo: number | null },
  user: { id: number; role: string },
) {
  if (user.role === "ADMIN") return true;
  return task.createdBy === user.id || task.assignedTo === user.id;
}

const findUserById = async (id: number) => {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
};

const insertTask = async (data: {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string; // YYYY-MM-DD
  assignedTo?: number;
  createdBy: number;
}) => {
  const [task] = await db.insert(tasks).values(data).returning();
  return task;
};

const findTaskById = async (id: number) => {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return task ?? null;
};

const listTasksForUser = async (
  user: { id: number; role: string },
  params: { page: number; limit: number },
): Promise<Paginated<Task>> => {
  const { page, limit } = params;
  const offset = (page - 1) * limit;

  const whereClause =
    user.role === "ADMIN"
      ? undefined
      : or(eq(tasks.createdBy, user.id), eq(tasks.assignedTo, user.id));

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(whereClause)
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(tasks).where(whereClause),
  ]);

  return { data: rows, pagination: buildPagination(page, limit, total) };
};

const updateTaskById = async (id: number, data: Partial<NewTask>) => {
  const [updated] = await db
    .update(tasks)
    .set(data)
    .where(eq(tasks.id, id))
    .returning();
  return updated;
};

const deleteTaskById = async (id: number) => {
  await db.delete(tasks).where(eq(tasks.id, id));
};

const tasksService = {
  findUserById,
  insertTask,
  findTaskById,
  listTasksForUser,
  updateTaskById,
  deleteTaskById,
  isValidStatusTransition,
  canModifyTask,
};

export default tasksService;
