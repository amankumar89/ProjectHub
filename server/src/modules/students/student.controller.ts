import type { Request, Response } from "express";
import { asyncHandler, generateRandomId } from "../../utils/helper";
import studentsService from "../../services/student.service";
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
} from "../../utils/response";

const enrollStudent = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, enrolledAt } = req.body;

  const existing = await studentsService.findStudentByEmail(email);
  if (existing) {
    return sendConflict(res, "A student with this student ID already exists");
  }

  const studentId = generateRandomId(new Date().getFullYear().toString());

  const student = await studentsService.insertStudent({
    studentId,
    name,
    email,
    phone,
    enrolledAt: new Date(enrolledAt).toISOString().slice(0, 10),
    addedBy: req.user!.id,
  });

  return sendCreated(res, "Student created successfully", student);
});

const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  const result = await studentsService.listStudents({ search, page, limit });

  return sendSuccess(res, "Students fetched successfully", {
    students: result.data,
    pagination: result.pagination,
  });
});

const getStudentById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req?.params?.id);
  if (!id) return sendBadRequest(res, "Invalid student id");

  const student = await studentsService.findActiveStudentById(id);
  if (!student) {
    return sendNotFound(res, "Student not found");
  }

  return sendSuccess(res, "Student fetched successfully", student);
});

const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { studentId, name, email, phone, enrolledAt } = req.body;

  const existing = await studentsService.findActiveStudentById(id);
  if (!existing) {
    return sendNotFound(res, "Student not found");
  }

  if (studentId && studentId !== existing.studentId) {
    const conflict = await studentsService.findStudentByStudentId(studentId);
    if (conflict) {
      return sendConflict(res, "A student with this student ID already exists");
    }
  }

  const updated = await studentsService.updateStudentById(id, {
    studentId,
    name,
    email,
    phone,
    enrolledAt: enrolledAt
      ? new Date(enrolledAt).toISOString().slice(0, 10)
      : undefined,
  });

  return sendSuccess(res, "Student updated successfully", updated);
});
const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existing = await studentsService.findActiveStudentById(id);
  if (!existing) {
    return sendNotFound(res, "Student not found");
  }

  const deleted = await studentsService.softDeleteStudentById(id);

  return sendSuccess(res, "Student deleted successfully", deleted);
});

const studentsController = {
  enrollStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

export default studentsController;
