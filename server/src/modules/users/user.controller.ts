import type { Request, Response } from "express";
import { asyncHandler, hashPassword, publicUser } from "../../utils/helper";
import {
  deleteUser,
  findAllUsers,
  findUserById,
  updateUser,
  createUser as saveUser,
} from "../../services/user.service";
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
  sendCreated,
  sendForbidden,
  sendInternalError,
  sendNotFound,
  sendSuccess,
} from "../../utils/response";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const tempUser: User = req.body;

  const [user] = await saveUser({
    ...tempUser,
    password: await hashPassword(tempUser.password ?? "admin"),
  });

  if (!user) return sendInternalError(res, "Failed to create user");

  return sendCreated(res, "User created", publicUser(user));
});

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
  return sendSuccess(res, "Data fetched successfully", users);
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  let tempId = Number(
    req.user?.role === "ADMIN" ? req.params.id : req.user?.id,
  );
  const user = await findUserById(tempId);
  if (!user) return sendNotFound(res, "User not Found");
  return sendSuccess(res, "User fetched successfully", profileUser(user));
});

const updateUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id) as any;

  if (isNaN(userId)) return sendBadRequest(res, "Invalid user ID");

  if (req.user?.role !== "ADMIN" && userId !== Number(req.user?.id)) {
    return sendForbidden(res);
  }

  const tempUser = req.body;

  if (req.body.password) {
    tempUser.password = await hashPassword(tempUser.password);
  }

  if (!tempUser || Object.keys(tempUser).length === 0)
    return sendBadRequest(res, "Request body cannot be empty.");

  const updatedUser = await updateUser(userId, tempUser);

  if (!updatedUser) return sendNotFound(res, "User not found");

  return sendSuccess(res, "User updated successfully", publicUser(updatedUser));
});

const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.id) as any;

  if (isNaN(userId)) return sendBadRequest(res, "Invalid user ID");

  const deletedUser = await deleteUser(userId);

  if (!deletedUser) return sendNotFound(res, "User not found");

  return sendSuccess(res, "User deleted successfully", deletedUser);
});

const usersController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default usersController;
