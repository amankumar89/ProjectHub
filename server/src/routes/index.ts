import { Router } from "express";
import homeRoutes from "./home.route";
import authRoutes from "../modules/auth/auth.route";
import usersRoute from "../modules/users/user.route";
import {
  authenticate,
  authorize,
} from "../middlewares/authenticate.middleware";
import { sendNotFound } from "../utils/response";
import studentRoute from "../modules/students/student.route";

const router = Router();

router.use("/", homeRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", authenticate, usersRoute);
router.use(
  "/api/students",
  [authenticate, authorize(["ADMIN", "TEACHER"])],
  studentRoute,
);
router.use("", (_req, res) => sendNotFound(res, "Route Not Found"));

export default router;
