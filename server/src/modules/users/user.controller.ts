import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/error-handler.middleware";
import { badRequest, notFound, success } from "../../utils/apiResponse";
import { findAllUsers, findUserById } from "../../services/user.service";
import {
  userRoleEnum,
  userStatusEnum,
  type User,
  type UserRole,
  type UserStatus,
} from "../../db/schema";
import { profileUser } from "../../utils/helper";

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
    return badRequest(res, `Role must be ${userRoleEnum.enumValues}`);
  }

  if (status && !userStatusEnum.enumValues.includes(status as UserStatus)) {
    return badRequest(res, `Status must be ${userStatusEnum.enumValues}`);
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
  success(res, users, "Data Fetched Successfully");
});
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  let tempId = Number(
    req.user?.role === "ADMIN" ? req.params.id : req.user?.id,
  );
  const [user] = await findUserById(tempId);
  if (!user) notFound(res, "User not Found");
  success(res, profileUser(user), "User Fetched Successfully");
});
const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  success(res, [], "User Updated Successfully");
});
const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  success(res, [], "User Deleted Successfully");
});

const usersController = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default usersController;
