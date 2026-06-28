import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import { findAllUsers, findUserById } from "../../services/user.service";
import {
  userRoleEnum,
  userStatusEnum,
  type User,
  type UserRole,
  type UserStatus,
} from "../../db/schema";
import { profileUser } from "../../utils/helper";
import {
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from "../../utils/response";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  let {
    page = 1,
    limit = 10,
    search,
    role,
    status,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  if (role && !userRoleEnum.enumValues.includes(role as UserRole)) {
    return sendBadRequest(res, `Role must be ${userRoleEnum.enumValues}`);
  }

  if (status && !userStatusEnum.enumValues.includes(status as UserStatus)) {
    return sendBadRequest(res, `Status must be ${userStatusEnum.enumValues}`);
  }

  page = Number(page);
  limit = Number(limit);

  const offset = (page - 1) * limit;

  const users = await findAllUsers(
    page as number,
    limit as number,
    offset as number,
    search as keyof Partial<User>,
    role as UserRole,
    status as UserStatus,
    sortBy as keyof User,
    order as "asc" | "desc",
  );
  sendSuccess(res, "Data fetched successfully", users);
});
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  let tempId = Number(
    req.user?.role === "ADMIN" ? req.params.id : req.user?.id,
  );
  const [user] = await findUserById(tempId);
  if (!user) sendNotFound(res, "User not Found");
  sendSuccess(res, "User fetched successfully", profileUser(user));
});
const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "User updated successfully", []);
});
const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, "User deleted successfully", []);
});

const usersController = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default usersController;
