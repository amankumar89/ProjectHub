import { Router } from "express";
import notesController from "./note.controller";
import validate from "../../middlewares/validation.middleware";
import {
  createNoteSchema,
  listNotesQuerySchema,
  noteIdParamSchema,
  updateNoteSchema,
} from "../../utils/validators";

const notesRoute = Router();

notesRoute.post("/", validate(createNoteSchema), notesController.createNote);
notesRoute.get("/", validate(listNotesQuerySchema), notesController.getAllNote);
notesRoute.get(
  "/:id",
  validate(noteIdParamSchema),
  notesController.getNoteById,
);
notesRoute.put(
  "/:id",
  validate(listNotesQuerySchema),
  validate(updateNoteSchema),
  notesController.updateNote,
);
notesRoute.delete(
  "/:id",
  validate(noteIdParamSchema),
  notesController.deleteNote,
);

export default notesRoute;
