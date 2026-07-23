import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import {
  sendBadRequest,
  sendForbidden,
  sendNotFound,
  sendSuccess,
} from "../../utils/response";
import tasksService from "../../services/task.service";

// CREATE TASK
const createTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    description,
    priority,
    dueDate,
    assignedTo = req.user!.id,
  } = req.body;

  if (assignedTo) {
    const assignee = await tasksService.findUserById(assignedTo);
    if (!assignee) {
      return sendBadRequest(res, "Assigned user does not exist");
    }
  }

  const task = await tasksService.insertTask({
    title,
    description,
    priority,
    dueDate: dueDate ? new Date(dueDate).toISOString().slice(0, 10) : undefined,
    assignedTo,
    createdBy: req.user!.id,
  });

  return sendSuccess(res, "Task created successfully", task);
});

// GET ALL TASK
const getAllTask = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  const result = await tasksService.listTasksForUser(user, { page, limit });

  return sendSuccess(res, "Tasks fetched successfully", {
    tasks: result.data,
    pagination: result.pagination,
  });
});

// GET TASK BY ID
const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = req.user!;

  const task = await tasksService.findTaskById(id);
  if (!task) {
    return sendNotFound(res, "Task not found");
  }

  if (!tasksService.canModifyTask(task, user)) {
    return sendForbidden(res, "You do not have access to this task");
  }

  return sendSuccess(res, "Task fetched successfully", task);
});

// UPDATE TASK
const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, status, priority, dueDate, assignedTo } =
    req.body;
  const user = req.user!;

  const existing = await tasksService.findTaskById(id);
  if (!existing) {
    return sendNotFound(res, "Task not found");
  }

  if (!tasksService.canModifyTask(existing, user)) {
    return sendForbidden(res, "You do not have permission to edit this task");
  }

  if (
    status &&
    !tasksService.isValidStatusTransition(existing.status, status)
  ) {
    return sendBadRequest(
      res,
      `Invalid status transition from ${existing.status} to ${status}. Status must move todo -> IN_PROGRESS -> COMPLETED.`,
    );
  }

  if (assignedTo) {
    const assignee = await tasksService.findUserById(assignedTo);
    if (!assignee) {
      return sendBadRequest(res, "Assigned user does not exist");
    }
  }

  const updated = await tasksService.updateTaskById(id, {
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate).toISOString().slice(0, 10) : undefined,
    assignedTo,
  });

  return sendSuccess(res, "Task updated successfully", updated);
});

// DELETE TASK
const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = req.user!;

  const existing = await tasksService.findTaskById(id);
  if (!existing) {
    return sendNotFound(res, "Task not found");
  }

  if (!tasksService.canModifyTask(existing, user)) {
    return sendForbidden(res, "You do not have permission to delete this task");
  }

  await tasksService.deleteTaskById(id);

  return sendSuccess(res, "Task deleted successfully", { id });
});

const tasksController = {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
};

export default tasksController;
