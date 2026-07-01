import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/helper";
import { sendSuccess } from "../../utils/response";

const enrollStudent = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "student enroll controller");
});
const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "student get-all controller");
});
const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "student get by id controller");
});
const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "student update controller");
});
const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  return sendSuccess(res, "student delete controller");
});

const studentController = {
  enrollStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

export default studentController;
