import { z } from "zod";
import { userRoleEnum, userStatusEnum } from "../db/schema";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50),

    email: z.email("Invalid email").transform((email) => email.toLowerCase()),

    password: z.string().min(4, "Password must be at least 4 characters"),
    // .max(100)
    // .regex(/[A-Z]/, "Must contain an uppercase letter")
    // .regex(/[a-z]/, "Must contain a lowercase letter")
    // .regex(/[0-9]/, "Must contain a number")
    // .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email").transform((email) => email.toLowerCase()),

    password: z
      .string("Password is required")
      .min(4, "Password must be atleast 4 character"),
  }),
});

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Name is required."),
      email: z.email("Please provide a valid email address."),
      password: z
        .string()
        .min(4, "Password must be at least 4 characters long.")
        .optional(),
      role: z
        .enum(userRoleEnum.enumValues, {
          error: `Role must be ${userRoleEnum.enumValues}`,
        })
        .optional(),

      status: z
        .enum(userStatusEnum.enumValues, {
          error: `Status must be ${userStatusEnum.enumValues}`,
        })
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Request body cannot be empty. Provide all required fields.",
    }),
});

export const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      email: z.email().optional(),
      password: z
        .string()
        .trim()
        .min(4, "Password must be atleast 4 character long")
        .optional(),
      role: z.enum(userRoleEnum.enumValues).optional(),
      status: z.enum(userStatusEnum.enumValues).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message:
        "Request body cannot be empty. Provide at least one field to update.",
    }),
});

// STUDENT
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

export const createStudentSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters"),
    rollNumber: z
      .string()
      .trim()
      .min(1, "Roll number is required")
      .max(50, "Roll number must not exceed 50 characters"),
    grade: gradeEnum.optional(),
    section: z.string().trim().max(10).optional(),
    guardianName: z.string().trim().max(100).optional(),
    guardianContact: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid contact number")
      .optional(),
    userId: z.number().int().positive().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateStudentSchema = z.object({
  body: z
    .object({
      fullName: z.string().trim().min(2).max(100).optional(),
      rollNumber: z.string().trim().min(1).max(50).optional(),
      grade: gradeEnum.optional(),
      section: z.string().trim().max(10).optional(),
      guardianName: z.string().trim().max(100).optional(),
      guardianContact: z
        .string()
        .trim()
        .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid contact number")
        .optional(),
      userId: z.number().int().positive().nullable().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED", "DELETED"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive("Invalid student id"),
  }),
});

export const getStudentSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive("Invalid student id"),
  }),
});

export const deleteStudentSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.coerce.number().int().positive("Invalid student id"),
  }),
});

export const listStudentsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    grade: gradeEnum.optional(),
    section: z.string().trim().optional(),
    status: z.enum(userStatusEnum.enumValues).optional(),
    search: z.string().trim().optional(),
    enrolledAt: z.date().optional(),
  }),
});
