import { Router } from "express";
import authController from "./auth.controller";
import validate from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../../utils/validation-schema";
import { authenticate } from "../../middlewares/authenticate.middleware";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), authController.register);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.get("/me", authenticate, authController.profile);
authRoutes.get("/logout", authenticate, authController.logout);
authRoutes.get("/refresh", authController.refreshToken);

export default authRoutes;
