// apiResponse.ts

import { Request, Response, NextFunction } from "express";

type ApiData = Record<string, unknown> | unknown[] | null;

interface ApiResponse<T extends ApiData = null> {
  success: boolean;
  message: string;
  data: T;
}

function send<T extends ApiData>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T,
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({ success, message, data });
}

// Success
export const success = <T extends ApiData>(
  res: Response,
  data: T,
  message = "Success",
) => send(res, 200, true, message, data);

export const created = <T extends ApiData>(
  res: Response,
  data: T,
  message = "Created successfully",
) => send(res, 201, true, message, data);

// Client errors
export const badRequest = (res: Response, message = "Bad request") =>
  send(res, 400, false, message, null);
export const unauthorized = (res: Response, message = "Unauthorized") =>
  send(res, 401, false, message, null);
export const forbidden = (res: Response, message = "Forbidden") =>
  send(res, 403, false, message, null);
export const notFound = (res: Response, message = "Resource not found") =>
  send(res, 404, false, message, null);
export const conflict = (res: Response, message = "Conflict") =>
  send(res, 409, false, message, null);

// Server Errors
export const internalError = (
  res: Response,
  message = "Internal server error",
) => send(res, 500, false, message, null);
