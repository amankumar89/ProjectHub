import { type User } from "../db/schema";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import argon2 from "argon2";

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const hashPassword = async (password: string) =>
  await argon2.hash(password);

export const comparePassword = async (hashPassword: string, password: string) =>
  await argon2.verify(hashPassword, password);

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const compareToken = (token: string, hash: string) =>
  crypto.createHash("sha256").update(token).digest("hex") === hash;

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

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function buildPagination(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function generateRandomId(
  year: string,
  charRange = "uppercase",
  numDigits = 3,
) {
  const chars =
    charRange === "uppercase"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : charRange === "lowercase"
        ? "abcdefghijklmnopqrstuvwxyz"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const randomChar = chars[Math.floor(Math.random() * chars.length)];
  const maxNum = Math.pow(10, numDigits) - 1;
  const randomNumber = String(Math.floor(Math.random() * maxNum) + 1).padStart(
    numDigits,
    "0",
  );

  return `${year}-${randomChar}-${randomNumber}`;
}
