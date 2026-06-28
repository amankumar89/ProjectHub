import { Router, type Request, type Response } from "express";
import { sendSuccess } from "../utils/response";

const homeRoutes = Router();

homeRoutes.get("/", (req: Request, res: Response) => {
  return sendSuccess(res, "ProjectHub server is up & running.", {
    api: {
      base: "/api",
      modules: {
        auth: "/api/auth",
        user: "/api/user",
        task: "/api/task",
        notes: "/api/notes",
        student: "/api/student",
      },
    },
    health: "/health",
    timestamp: new Date().toISOString(),
  });
});

homeRoutes.get("/health", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "ProjectHub Server is up & running.",
  });
});

export default homeRoutes;
