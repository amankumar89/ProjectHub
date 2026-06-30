import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { UserRole, UserStatus } from "../db/schema";
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
  status?: UserStatus;
}

const signToken = (
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

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const generateTokens = async (payload: JwtPayload) => {
  const [accessToken, refreshToken] = await Promise.all([
    signToken(
      payload,
      JWT_ACCESS_SECRET!,
      JWT_ACCESS_EXPIRES_IN! as SignOptions["expiresIn"],
    ),
    signToken(
      payload,
      JWT_REFRESH_SECRET!,
      JWT_REFRESH_EXPIRES_IN! as SignOptions["expiresIn"],
    ),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};
