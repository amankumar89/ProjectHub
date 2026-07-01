import { Router } from "express";
import studentsController from "./student.controller";

const studentsRoute = Router();

studentsRoute.post("/", studentsController.enrollStudent);
studentsRoute.get("/", studentsController.getAllStudents);
studentsRoute.get("/:id", studentsController.getStudentById);
studentsRoute.put("/:id", studentsController.updateStudent);
studentsRoute.delete("/:id", studentsController.deleteStudent);

export default studentsRoute;
