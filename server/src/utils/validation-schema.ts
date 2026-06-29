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

    password: z.string().min(1, "Password is required"),
  }),
});

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: z.email("Please provide a valid email address."),
    password: z.string().min(4, "Password must be at least 8 characters long."),
    role: z.enum(["ADMIN", "USER"], {
      error: `Role must be ${userRoleEnum.enumValues}`,
    }),

    status: z.enum(userStatusEnum.enumValues, {
      error: `Status must be ${userStatusEnum.enumValues}`,
    }),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Request body cannot be empty. Provide all required fields.",
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(8).optional(),
    role: z.enum(userRoleEnum.enumValues).optional(),
    status: z.enum(userStatusEnum.enumValues).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message:
      "Request body cannot be empty. Provide at least one field to update.",
  });
