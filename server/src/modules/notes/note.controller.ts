import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import { sendSuccess } from "../../utils/response";

const createNote = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task create controller");
});

const getAllNote = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task get-all controller");
});

const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task get-by-id controller");
});

const updateNote = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task update controller");
});

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "task delete controller");
});

const notesController = {
  createNote,
  getAllNote,
  getNoteById,
  updateNote,
  deleteNote,
};

export default notesController;
