import { Router } from "express";
import homeRoutes from "./home.route";
import authRoutes from "../modules/auth/auth.route";
import { notFound } from "../utils/apiResponse";
import usersRoute from "../modules/users/user.route";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.use("/", homeRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/users", authenticate, usersRoute);
router.use("", (_req, res) => notFound(res, "Route Not Found"));

export default router;
