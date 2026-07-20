import { z } from "zod";
import { statusEnum } from "../../db/schema";

export const createStudentSchema = z.object({
  body: z.object({
    name: z.string("Name is requried").min(2).max(150),
    email: z.email("Invalid email").max(255).optional(),
    phone: z.string().max(20).optional(),
    enrolledAt: z.coerce.date(),
  }),
});

export const updateStudentSchema = createStudentSchema.partial();

export const studentIdParamSchema = z.object({
  param: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

const gradeEnum = z.enum([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
]);

export const listStudentsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    grade: gradeEnum.optional(),
    section: z.string().trim().optional(),
    status: z.enum(statusEnum.enumValues).optional(),
    search: z.string().trim().optional(),
    enrolledAt: z.date().optional(),
  }),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
