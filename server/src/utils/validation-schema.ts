import { z } from "zod";

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
