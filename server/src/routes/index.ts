import { Router } from "express";
import homeRoutes from "./home.route";
import authRoutes from "../modules/auth/auth.route";
import usersRoute from "../modules/users/user.route";
import {
  authenticate,
  authorize,
} from "../middlewares/authenticate.middleware";
import { sendNotFound } from "../utils/response";
import studentsRoute from "../modules/students/student.route";
import tasksRoute from "../modules/tasks/task.route";
import notesRoute from "../modules/notes/note.route";

const router = Router();

router.use("/", homeRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", authenticate, usersRoute);
router.use(
  "/api/students",
  [authenticate, authorize(["ADMIN", "TEACHER"])],
  studentsRoute,
);
router.use("/api/notes", authenticate, notesRoute);
router.use("/api/tasks", authenticate, tasksRoute);
router.use("", (_req, res) => sendNotFound(res, "Route Not Found"));

export default router;
