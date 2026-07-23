import { Router } from "express";
import tasksController from "./task.controller";
import validate from "../../middlewares/validation.middleware";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../../utils/validators";

const tasksRoute = Router();

tasksRoute.post("/", validate(createTaskSchema), tasksController.createTask);
tasksRoute.get("/", validate(listTasksQuerySchema), tasksController.getAllTask);
tasksRoute.get(
  "/:id",
  validate(taskIdParamSchema),
  tasksController.getTaskById,
);
tasksRoute.put(
  "/:id",
  [validate(taskIdParamSchema), validate(updateTaskSchema)],
  tasksController.updateTask,
);
tasksRoute.delete(
  "/:id",
  validate(taskIdParamSchema),
  tasksController.deleteTask,
);

export default tasksRoute;
