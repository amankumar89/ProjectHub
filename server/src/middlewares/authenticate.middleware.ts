import type { Request, Response, NextFunction } from "express";
import { type Secret } from "jsonwebtoken";
import { verifyToken, type JwtPayload } from "../utils/jwt";
import { JWT_ACCESS_SECRET } from "../config/env";
import { asyncHandler } from "./error-handler.middleware";
import { unauthorized } from "../utils/apiResponse";
import type { UserRole } from "../db/schema";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const getToken = (req: AuthRequest) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies?.token;
};

export const authenticate = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = getToken(req);

    if (!token) {
      return unauthorized(res, "Unauthorized");
    }

    const decoded = (await verifyToken(
      token,
      JWT_ACCESS_SECRET as Secret,
    )) as JwtPayload;

    if (!decoded) return unauthorized(res, "Unauthorized: Token Expired");

    req.user = decoded;

    next();
  },
);

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
