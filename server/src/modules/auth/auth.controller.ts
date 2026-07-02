import type { Request, Response } from "express";
import { asyncHandler, compareToken, hashToken } from "../../utils/helper";
import type { NewUser } from "../../db/schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../../services/user.service";
import {
  comparePassword,
  hashPassword,
  profileUser,
  publicUser,
} from "../../utils/helper";
import { generateTokens, verifyToken, type JwtPayload } from "../../utils/jwt";
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendForbidden,
  sendInternalError,
  sendNotAuthorized,
  sendNotFound,
  sendSuccess,
} from "../../utils/response";
import { JWT_REFRESH_SECRET } from "../../config/env";
import type { Secret } from "jsonwebtoken";

const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 2 * 24 * 60 * 60 * 1000, // 1 days
};

// register
const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: NewUser = req.body;

  // check email already exists or not
  const user = await findUserByEmail(email);

  // if yes return error
  if (user?.email) return sendConflict(res, "Email already exists");

  // hashed password
  const passwordHashed = await hashPassword(password);

  // save user
  const [savedUser] = await createUser({
    ...req.body,
    password: passwordHashed,
  });

  // return 201 user created
  return sendCreated(res, "User created successfully", publicUser(savedUser));
});

// login
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // check user exists or not, if not return error 401
  const user = await findUserByEmail(email);

  if (!user) return sendNotAuthorized(res, "Invalid username or password");

  // verify password if not correct return error 401
  const passwordValid = await comparePassword(user.password, password);

  if (!passwordValid)
    return sendNotAuthorized(res, "Invalid username or password");

  if (user.status === "DELETED") return sendNotFound(res, "User not found");

  if (user.status !== "ACTIVE")
    return sendNotAuthorized(res, "User is not ACTIVE");

  // generate access, refresh token and return it
  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // hash refresh token before saving into db
  const hashRefreshToken = hashToken(refreshToken);

  // save user with refresh token and last login
  const savedUser = await updateUser(user.id, {
    lastLogin: new Date(),
    refreshToken: hashRefreshToken,
  });

  if (!savedUser) return sendInternalError(res, "Failed to login.");

  res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
  console.log(accessToken);

  return sendSuccess(res, "Logged in successfull", {
    user: publicUser(user),
    token: accessToken,
  });
});

// user profile
const profile = asyncHandler(async (req: Request, res: Response) => {
  // if authorized user exists return it data
  const user = await findUserById(Number(req.user?.id));

  if (!user) return sendNotFound(res, "User not found");

  return sendSuccess(res, "Data fetched successfully", profileUser(user));
});

// logout
const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.user!.id);
  if (isNaN(userId)) return sendBadRequest(res, "Invalid user ID");
  const user = await updateUser(userId, {
    refreshToken: null,
  });
  if (!user) return sendInternalError(res, "Failed to logout");

  // remove token access, refresh both
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

  return sendSuccess(res, "Logout successfully", null);
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const rToken = req.cookies?.refreshToken;

  if (!rToken) return sendNotAuthorized(res, "Refresh token missing");

  // verify refresh token if error return
  const decode = verifyToken(
    rToken,
    JWT_REFRESH_SECRET as Secret,
  ) as JwtPayload;

  if (!decode) return sendNotAuthorized(res, "Refresh Token not valid or used");

  // find user if not found return error
  const user = await findUserById(Number(decode.id));

  if (!user) return sendNotAuthorized(res, "Refresh Token not valid or used");

  // check account is active or not
  if (user.status !== "ACTIVE")
    return sendForbidden(res, "Forbidden: contact admin");

  // compare stored token with incoming token
  const isValidToken = await compareToken(rToken, user.refreshToken!);

  if (!isValidToken)
    return sendNotAuthorized(res, "Refresh Token not valid or used");

  // generate new access, refresh token
  const { accessToken, refreshToken } = await generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // save user with refresh token and last login
  const savedUser = await updateUser(user.id, {
    lastLogin: new Date(),
    refreshToken: hashToken(refreshToken),
  });

  if (!savedUser) return sendInternalError(res, "Failed to get refresh token.");

  res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);

  return sendSuccess(res, "Token Refreshed", {
    token: accessToken,
  });
});

const authController = {
  register,
  login,
  profile,
  logout,
  refreshToken,
};

export default authController;
