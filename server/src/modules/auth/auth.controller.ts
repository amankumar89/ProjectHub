import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import type { NewUser } from "../../db/schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../../services/user.service";
import {
  comparePassword,
  hashedPassword,
  profileUser,
  publicUser,
} from "../../utils/helper";
import { generateToken } from "../../utils/jwt";
import {
  sendConflict,
  sendCreated,
  sendNotAuthorized,
  sendNotFound,
  sendSuccess,
} from "../../utils/response";

const COOKIE_NAME = "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
};

// register
const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: NewUser = req.body;

  // check email already exists or not
  const existingEmail = await findUserByEmail(email);

  // if yes return error
  if (existingEmail.length > 0)
    return sendConflict(res, "Email already exists");

  // hashed password
  const passwordHashed = await hashedPassword(password);

  // save user
  const [savedUser] = await createUser({
    ...req.body,
    password: passwordHashed,
  });

  // generate token
  const token = await generateToken("access", {
    email,
    id: savedUser.id,
    role: savedUser.role,
  });

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

  // return 201 user created
  return sendCreated(res, "User created successfully", publicUser(savedUser));
});

// login
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // check user exists or not, if not return error 401
  const [user] = await findUserByEmail(email);
  if (!user) return sendNotAuthorized(res, "Invalid username or password");

  // verify password if not correct return error 401
  const passwordValid = await comparePassword(password, user.password);
  if (!passwordValid)
    return sendNotAuthorized(res, "Invalid username or password");

  if (user.status !== "ACTIVE")
    return sendSuccess(res, "User is not ACTIVE", null);

  // generate token and return it
  const token = await generateToken("access", {
    email,
    id: user.id,
    role: user.role,
  });

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  console.log(token);

  sendSuccess(res, "Logged in successfull", { user: publicUser(user), token });
});

// user profile
const profile = asyncHandler(async (req: Request, res: Response) => {
  // if authorized user exists return it data
  const [user] = await findUserById(Number(req.user?.id));

  if (!user) return sendNotFound(res, "User not found");

  return sendSuccess(res, "Data fetched successfully", profileUser(user));
});

// logout
const logout = asyncHandler(async (req: Request, res: Response) => {
  // remove token access, refresh both
  res.clearCookie("token", COOKIE_OPTIONS);

  return sendSuccess(res, "Logout successfully", null);
});

const authController = {
  register,
  login,
  profile,
  logout,
};

export default authController;
