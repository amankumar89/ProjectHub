import { NextFunction, Request, Response } from "express";
import { internalError } from "../utils/apiResponse";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  internalError(res);
};

export const wrap =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);
