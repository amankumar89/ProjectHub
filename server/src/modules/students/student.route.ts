import { Router } from "express";
import studentsController from "./student.controller";
import validate from "../../middlewares/validation.middleware";
import {
  createStudentSchema,
  deleteStudentSchema,
  getStudentSchema,
  listStudentsSchema,
  updateStudentSchema,
} from "../../utils/validation-schema";

const studentsRoute = Router();

// CREATE STUDENT
studentsRoute.post(
  "/",
  validate(createStudentSchema),
  studentsController.createStudent,
);

// GET ALL STUDENTS
studentsRoute.get(
  "/",
  validate(listStudentsSchema),
  studentsController.getAllStudents,
);

// GET STUDENT BY ID
studentsRoute.get(
  "/:id",
  validate(getStudentSchema),
  studentsController.getStudentById,
);

// UPDATE STUDENT BY ID
studentsRoute.put(
  "/:id",
  validate(updateStudentSchema),
  studentsController.updateStudentById,
);

// DELETE STUDENT BY ID
studentsRoute.delete(
  "/:id",
  validate(deleteStudentSchema),
  studentsController.deleteStudentById,
);

export default studentsRoute;
