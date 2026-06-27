import bcrypt from "bcryptjs";
import { users, type User } from "../db/schema";

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
