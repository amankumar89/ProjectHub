import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(255, "Title must be less than 255 characters"),
    body: z.string().optional().nullable(),
  }),
});

export const updateNoteSchema = z.object({
  body: createNoteSchema.shape.body.partial(),
  params: z.object({
    id: z.coerce.number().int().positive("Note ID must be a positive integer"),
  }),
});

export const noteIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Note ID must be a positive integer"),
  }),
});

export const listNotesQuerySchema = z.object({
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

export type CreateNoteInput = z.infer<typeof createNoteSchema>["body"];
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>["body"];
