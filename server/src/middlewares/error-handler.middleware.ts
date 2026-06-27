import type { NextFunction, Request, RequestHandler, Response } from "express";
import { internalError, unauthorized } from "../utils/apiResponse";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (["JsonWebTokenError", "TokenExpiredError"].includes(err.name)) {
    return unauthorized(res, "Token expired or invalid");
  }

  console.error(err);
  internalError(res);
};

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    Promise.resolve(fn(req, res, next)).catch(next);
