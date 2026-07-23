import { z } from "zod";

export const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string("Title is required").min(1).max(200),
    description: z.string().max(5000).optional(),
    priority: taskPriorityEnum.optional().default("MEDIUM"),
    dueDate: z.coerce.date().optional(),
    assignedTo: z.coerce.number().int().positive().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string("Title is required").min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    dueDate: z.coerce.date().optional(),
    assignedTo: z.coerce.number().int().positive().optional(),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const listTasksQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "title", "id"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    search: z.string().optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
