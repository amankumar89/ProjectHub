import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { NewUser, UserRole } from "../db/schema";
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
} from "../config/env";

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export const signToken = (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"],
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "HS256",
    issuer: "PROJECT-HUB",
  });
};

export const verifyToken = async (token: string, secret: Secret) => {
  return await jwt.verify(token, secret);
};

export const generateToken = async (
  type: "access" | "refresh",
  payload: {
    id: number;
    email: string;
    role: "USER" | "ADMIN" | "TEACHER";
  },
) => {
  const secret: Secret =
    type === "access" ? JWT_ACCESS_SECRET! : JWT_REFRESH_SECRET!;

  const expiresIn =
    type === "access"
      ? (JWT_ACCESS_EXPIRES_IN! as SignOptions["expiresIn"])
      : (JWT_REFRESH_EXPIRES_IN! as SignOptions["expiresIn"]);

  return await signToken(payload, secret, expiresIn);
};
