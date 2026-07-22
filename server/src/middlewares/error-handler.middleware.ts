// import type { NextFunction, Request, RequestHandler, Response } from "express";
// import { internalError, unauthorized } from "../utils/apiResponse";
// import { ZodError } from "zod";

// export const errorHandler = (
//   err: Error,
//   _req: Request,
//   res: Response,
//   _next: NextFunction,
// ) => {
//   if (err instanceof ZodError) {
//     return res.status(400).json({
//       success: false,
//       message: err?.issues?.[0].message ?? "Validation failed",
//       errors: err.issues.map((issue) => ({
//         field: issue.path.join("."),
//         message: issue.message,
//       })),
//     });
//   }

//   if (["JsonWebTokenError", "TokenExpiredError"].includes(err.name)) {
//     return unauthorized(res, "Token expired or invalid");
//   }

//   console.error(err);
//   internalError(res);
// };

import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { ZodError } from "zod";
import { sendNotAuthorized } from "../utils/response";

// ─── Postgres/Drizzle error codes ────────────────────────────────────────────
const PG_ERROR_MAP: Record<string, { status: number; message: string }> = {
  "23505": { status: 409, message: "Duplicate entry — record already exists." },
  "23503": {
    status: 409,
    message: "Referenced record does not exist (foreign key violation).",
  },
  "23502": {
    status: 400,
    message: "A required field is missing a value (not-null violation).",
  },
  "23514": {
    status: 400,
    message: "A value failed a database check constraint.",
  },
  "42P01": {
    status: 500,
    message: "Internal error — database table not found.",
  },
  "42703": {
    status: 500,
    message: "Internal error — unknown database column.",
  },
  "28P01": { status: 500, message: "Database authentication failed." },
  "3D000": { status: 500, message: "Database does not exist." },
  "53300": {
    status: 503,
    message: "Too many database connections — please try again later.",
  },
  "57014": { status: 408, message: "Database query was cancelled (timeout)." },
  "40001": {
    status: 503,
    message: "Transaction conflict — please retry the request.",
  },
};

// ─── Type guard for Postgres/Drizzle errors ──────────────────────────────────
function isDbError(err: unknown): err is { code: string; detail?: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as Record<string, unknown>).code === "string"
  );
}

// ─── Standard API response shape ─────────────────────────────────────────────
function sendError(
  res: Response,
  statusCode: number,
  message: string,
  data: null | object | unknown[] = null,
) {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
}

// ─── Global error handler ─────────────────────────────────────────────────────
export const globalErrorHandler = (
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // 1. Zod validation errors
  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    sendError(res, 422, err?.issues?.[0].message ?? "Validation failed.", null);
    return;
  }

  if (["JsonWebTokenError", "TokenExpiredError"].includes(err?.name)) {
    return sendNotAuthorized(res, "Token expired or invalid");
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.data);
    return;
  }

  // 3. Postgres / Drizzle DB errors
  if (isDbError(err)) {
    const mapped = PG_ERROR_MAP[err.code];

    if (mapped) {
      sendError(res, mapped.status, mapped.message);
      return;
    }

    // Unmapped DB error — still don't leak raw detail in production
    const message =
      process.env.NODE_ENV === "production"
        ? "A database error occurred."
        : (err.detail ?? `Database error (code: ${err.code})`);

    sendError(res, 500, message);
    return;
  }

  // 4. Generic / unknown errors
  const isDev = process.env.NODE_ENV !== "production";
  const message =
    isDev && err instanceof Error
      ? err.message
      : "An unexpected error occurred. Please try again later.";

  if (isDev && err instanceof Error) {
    console.error("[GlobalErrorHandler]", err.stack);
  }

  sendError(res, 500, message);
};

export class AppError extends Error {
  public statusCode: number;
  public data: null | object | unknown[];

  constructor(
    statusCode: number,
    message: string,
    data: null | object | unknown[] = null,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.data = data;

    // Maintains proper stack trace (V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}
