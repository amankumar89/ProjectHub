import { Router } from "express";
import validate from "../../middlewares/validation.middleware";
import {
  createStudentSchema,
  listStudentsQuerySchema,
  studentIdParamSchema,
  updateStudentSchema,
} from "../../utils/validators";
import studentsController from "./student.controller";

const studentsRoute = Router();

// CREATE STUDENT
studentsRoute.post(
  "/",
  validate(createStudentSchema),
  studentsController.enrollStudent,
);

// GET ALL STUDENTS
studentsRoute.get(
  "/",
  validate(listStudentsQuerySchema),
  studentsController.getAllStudents,
);

// GET STUDENT BY ID
studentsRoute.get(
  "/:id",
  validate(studentIdParamSchema),
  studentsController.getStudentById,
);

// UPDATE STUDENT BY ID
studentsRoute.put(
  "/:id",
  validate(updateStudentSchema),
  studentsController.updateStudent,
);

// DELETE STUDENT BY ID
studentsRoute.delete(
  "/:id",
  validate(studentIdParamSchema),
  studentsController.deleteStudent,
);

export default studentsRoute;
