import { Router } from "express";
import tasksController from "./task.controller";

const tasksRoute = Router();

tasksRoute.post("/", tasksController.createTask);
tasksRoute.get("/", tasksController.getAllTask);
tasksRoute.get("/:id", tasksController.getTaskById);
tasksRoute.put("/:id", tasksController.updateTask);
tasksRoute.delete("/:id", tasksController.deleteTask);

export default tasksRoute;
