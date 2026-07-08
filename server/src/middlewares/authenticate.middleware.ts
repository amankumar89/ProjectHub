import type { Request, Response, NextFunction } from "express";
import { type Secret } from "jsonwebtoken";
import { verifyToken, type JwtPayload } from "../utils/jwt";
import { JWT_ACCESS_SECRET } from "../config/env";
import { asyncHandler } from "../utils/helper";
import type { UserRole } from "../db/schema";
import { sendForbidden, sendNotAuthorized } from "../utils/response";
import userService from "../services/user.service";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    const authHeader = req.headers?.authorization;

    if (authHeader?.startsWith("Bearer ")) token = authHeader?.split(" ")[1];

    if (!token) return sendNotAuthorized(res, "Unauthorized");

    const decoded = verifyToken(
      token,
      JWT_ACCESS_SECRET as Secret,
    ) as JwtPayload;

    if (!decoded) return sendNotAuthorized(res, "Unauthorized: Token Expired");

    const tempUser = await userService.findUserById(decoded.id);

    if (!tempUser?.id) return sendNotAuthorized(res, "Unauthorized");

    req.user = decoded;
    req.user.status = tempUser.status;
    next();
  },
);

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendNotAuthorized(res, "Unauthorized");

    if (req.user.status !== "ACTIVE") {
      return sendForbidden(res, `Account is ${req.user.status}`);
    }

    if (!allowedRoles.includes(req.user.role)) return sendForbidden(res);
    next();
  };
};
