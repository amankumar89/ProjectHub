import { Router } from "express";
import usersController from "./user.controller";
import { authorize } from "../../middlewares/authenticate.middleware";
import validate from "../../middlewares/validation.middleware";
import { updateUserSchema } from "../../utils/validation-schema";

const usersRoute = Router();

usersRoute.get("/", authorize(["ADMIN"]), usersController.getAllUsers);
usersRoute.get("/:id", usersController.getUserById);
usersRoute.post(
  "/",
  [validate(updateUserSchema), authorize(["ADMIN"])],
  usersController.createUser,
);
usersRoute.patch(
  "/:id",
  validate(updateUserSchema),
  usersController.updateUserById,
);
usersRoute.delete("/:id", usersController.deleteUserById);

export default usersRoute;
