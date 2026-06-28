import bcrypt from "bcryptjs";
import { type User } from "../db/schema";
import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const hashedPassword = async (password: string, salt: number = 12) =>
  await bcrypt.hash(password, salt);

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => await bcrypt.compare(password, hashedPassword);

export const publicUser = (data: User) => ({
  id: data?.id,
  name: data?.name,
  email: data?.email,
  role: data?.role,
  status: data?.status,
});

export const profileUser = (data: User) => ({
  ...publicUser(data),
  lastLogin: data?.lastLogin,
  createdAt: data?.createdAt,
  updatedAt: data?.updatedAt,
});
