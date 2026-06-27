import { Router, type Request, type Response } from "express";
import { success } from "../utils/apiResponse";

const homeRoutes = Router();

homeRoutes.get("/", (req: Request, res: Response) => {
  return success(
    res,
    {
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
    },
    "ProjectHub Server is up & running.",
  );
});

homeRoutes.get("/health", (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: "ProjectHub Server is up & running.",
  });
});

export default homeRoutes;
