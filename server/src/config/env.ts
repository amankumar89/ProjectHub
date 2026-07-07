import "dotenv/config";

function getEnv(name: string | undefined): string {
  const value = process.env[name!];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const PORT = getEnv("PORT");
export const DATABASE_URL = getEnv("DATABASE_URL");
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const JWT_ACCESS_EXPIRES_IN = getEnv("JWT_ACCESS_EXPIRES_IN");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const JWT_REFRESH_EXPIRES_IN = getEnv("JWT_REFRESH_EXPIRES_IN");
export const FRONTEND_URL = getEnv("FRONTEND_URL");
