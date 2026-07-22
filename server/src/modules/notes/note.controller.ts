import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import { sendNotFound, sendSuccess } from "../../utils/response";
import notesService from "../../services/note.service";

const createNote = asyncHandler(async (req: Request, res: Response) => {
  const { title, body } = req.body;

  const note = await notesService.insertNote({
    title,
    body,
    userId: req.user!.id,
  });

  return sendSuccess(res, "Note created successfully", note);
});

const getAllNote = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const userId = req.user!.id;

  const result = await notesService.listNotesForUser(userId, {
    search,
    page,
    limit,
  });

  return sendSuccess(res, "Notes fetched successfully", {
    notes: result.data,
    pagination: result.pagination,
  });
});

const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;

  const note = await notesService.findOwnedNoteById(id, userId);
  if (!note) {
    return sendNotFound(res, "Note not found");
  }

  return sendSuccess(res, "Note fetched successfully", note);
});

const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, body } = req.body;
  const userId = req.user!.id;

  const existing = await notesService.findOwnedNoteById(id, userId);
  if (!existing) {
    return sendNotFound(res, "Note not found");
  }

  const updated = await notesService.updateNoteById(id, { title, body });

  return sendSuccess(res, "Note updated successfully", updated);
});

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = req.user!.id;

  const existing = await notesService.findOwnedNoteById(id, userId);
  if (!existing) {
    return sendNotFound(res, "Note not found");
  }

  await notesService.deleteNoteById(id);

  return sendSuccess(res, "Note deleted successfully", { id });
});

const notesController = {
  createNote,
  getAllNote,
  getNoteById,
  updateNote,
  deleteNote,
};

export default notesController;
