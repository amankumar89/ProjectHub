import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import { sendSuccess } from "../../utils/response";

const createTask = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task create controller");
});
const getAllTask = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task get-all controller");
});
const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task get-by-id controller");
});
const updateTask = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task update controller");
});
const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task delete controller");
});

const tasksController = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
};

export default tasksController;
