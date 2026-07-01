import { Router } from "express";
import notesController from "./note.controller";

const notesRoute = Router();

notesRoute.post("/", notesController.createNote);
notesRoute.get("/", notesController.getAllNote);
notesRoute.get("/:id", notesController.getNoteById);
notesRoute.put("/:id", notesController.updateNote);
notesRoute.delete("/:id", notesController.deleteNote);

export default notesRoute;
