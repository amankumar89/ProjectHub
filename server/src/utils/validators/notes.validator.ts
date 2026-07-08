import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string().max(20000).optional(),
});

export const updateNoteSchema = createNoteSchema.partial();

export const noteIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listNotesQuerySchema = z.object({
  search: z.string().max(255).optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
