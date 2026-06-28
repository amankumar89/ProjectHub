import type { Response } from "express";

type ResponseData = null | object | unknown[];

interface ApiResponse {
  success: boolean;
  message: string;
  data: ResponseData;
}

function send(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: ResponseData = null,
): Response<any, Record<string, any>> {
  const body: ApiResponse = { success, message, data };
  return res.status(statusCode).json(body);
}

/**
 * 200 OK (default) or any 2xx
 * @example
 * sendSuccess(res, "Users fetched.", users);
 * sendSuccess(res, "User created.", user, 201);
 */
export function sendSuccess(
  res: Response,
  message: string = "Success.",
  data: ResponseData = null,
  statusCode: number = 200,
): void {
  send(res, statusCode, true, message, data);
}

/**
 * 201 Created
 * @example
 * sendCreated(res, "User created.", user);
 */
export function sendCreated(
  res: Response,
  message: string = "Resource created successfully.",
  data: ResponseData = null,
): void {
  send(res, 201, true, message, data);
}

/**
 * 204 No Content — no body sent (HTTP spec)
 * @example
 * sendNoContent(res);
 */
export function sendNoContent(
  res: Response,
): Response<any, Record<string, any>> {
  return res.status(204).send();
}

// ─── Client errors (4xx) ──────────────────────────────────────────────────────

/**
 * 400 Bad Request
 * @example
 * sendBadRequest(res);
 * sendBadRequest(res, "Invalid email format.");
 * sendBadRequest(res, "Validation failed.", fieldErrors);
 */
export function sendBadRequest(
  res: Response,
  message: string = "Bad request.",
  data: ResponseData = null,
): void {
  send(res, 400, false, message, data);
}

/**
 * 401 Unauthorized — not logged in / invalid token
 * @example
 * sendNotAuthorized(res);
 * sendNotAuthorized(res, "Token has expired.");
 */
export function sendNotAuthorized(
  res: Response,
  message: string = "Unauthorized. Please log in.",
): void {
  send(res, 401, false, message);
}

/**
 * 403 Forbidden — logged in but lacks permission
 * @example
 * sendForbidden(res);
 * sendForbidden(res, "Admins only.");
 */
export function sendForbidden(
  res: Response,
  message: string = "Forbidden. You do not have permission to perform this action.",
): void {
  send(res, 403, false, message);
}

/**
 * 404 Not Found
 * @example
 * sendNotFound(res);
 * sendNotFound(res, "User not found.");
 */
export function sendNotFound(
  res: Response,
  message: string = "Resource not found.",
): void {
  send(res, 404, false, message);
}

/**
 * 409 Conflict — duplicate, state mismatch, etc.
 * @example
 * sendConflict(res);
 * sendConflict(res, "Email already in use.");
 */
export function sendConflict(
  res: Response,
  message: string = "Conflict. Resource already exists or state mismatch.",
): void {
  send(res, 409, false, message);
}

/**
 * 422 Unprocessable Entity — semantic validation errors
 * @example
 * sendUnprocessable(res, "Validation failed.", fieldErrors);
 */
export function sendUnprocessable(
  res: Response,
  message: string = "Validation failed.",
  data: ResponseData = null,
): void {
  send(res, 422, false, message, data);
}

/**
 * 429 Too Many Requests
 * @example
 * sendTooManyRequests(res);
 * sendTooManyRequests(res, "Slow down! Try again in 60 seconds.");
 */
export function sendTooManyRequests(
  res: Response,
  message: string = "Too many requests. Please try again later.",
): void {
  send(res, 429, false, message);
}

// ─── Server errors (5xx) ──────────────────────────────────────────────────────

/**
 * 500 Internal Server Error
 * @example
 * sendInternalError(res);
 * sendInternalError(res, "Failed to connect to payment provider.");
 */
export function sendInternalError(
  res: Response,
  message: string = "An unexpected error occurred. Please try again later.",
): void {
  send(res, 500, false, message);
}

/**
 * 503 Service Unavailable
 * @example
 * sendServiceUnavailable(res);
 * sendServiceUnavailable(res, "Database is temporarily unavailable.");
 */
export function sendServiceUnavailable(
  res: Response,
  message: string = "Service temporarily unavailable. Please try again later.",
): void {
  send(res, 503, false, message);
}
