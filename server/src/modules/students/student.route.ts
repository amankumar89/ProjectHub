import { Router } from "express";
import validate from "../../middlewares/validation.middleware";
import {
  createStudentSchema,
  listStudentsQuerySchema,
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
studentsRoute.get("/:id", studentsController.getStudentById);

// UPDATE STUDENT BY ID
studentsRoute.put(
  "/:id",
  validate(updateStudentSchema),
  studentsController.updateStudent,
);

// DELETE STUDENT BY ID
studentsRoute.delete("/:id", studentsController.deleteStudent);

export default studentsRoute;
