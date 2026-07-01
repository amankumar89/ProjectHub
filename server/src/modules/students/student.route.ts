import { Router } from "express";
import studentController from "./student.controller";

const studentRoute = Router();

studentRoute.post("/", studentController.enrollStudent);
studentRoute.get("/", studentController.getAllStudents);
studentRoute.get("/:id", studentController.getStudentById);
studentRoute.put("/:id", studentController.updateStudent);
studentRoute.delete("/:id", studentController.deleteStudent);

export default studentRoute;
