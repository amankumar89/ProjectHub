import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/authenticate.middleware"; // adjust path to your actual auth middleware file
import { asyncHandler } from "../../utils/helper";
import { sendSuccess, sendCreated, sendNotFound } from "../../utils/response";
import {
  saveStudent,
  updateStudent,
  softDeleteStudent,
  findStudentById,
  findAllStudents,
} from "../../services/student.service";

const createStudent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const student = await saveStudent(req.body, req.user!.id);
  sendCreated(res, "Student created successfully.", student);
});

const getStudentById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const student = await findStudentById(id);

  if (!student || student.deletedAt) {
    return sendNotFound(res, "Student not found.");
  }

  sendSuccess(res, "Student fetched successfully.", student);
});

const getAllStudents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page, limit, grade, section, status, search } = req.query as any;

  const result = await findAllStudents({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    grade: grade as string | undefined,
    section: section as string | undefined,
    status: status as any,
    search: search as string | undefined,
  });

  sendSuccess(res, "Students fetched successfully.", result);
});

const updateStudentById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const updated = await updateStudent(id, req.body);

    if (!updated) {
      return sendNotFound(res, "Student not found.");
    }

    sendSuccess(res, "Student updated successfully.", updated);
  },
);

const deleteStudentById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id);
    const deleted = await softDeleteStudent(id);

    if (!deleted) {
      return sendNotFound(res, "Student not found.");
    }

    sendSuccess(res, "Student deleted successfully.");
  },
);

const studentsController = {
  createStudent,
  updateStudentById,
  getStudentById,
  getAllStudents,
  deleteStudentById,
};

export default studentsController;
