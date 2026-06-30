import { Router } from "express";
import usersController from "./user.controller";
import {
  authenticate,
  authorize,
} from "../../middlewares/authenticate.middleware";
import validate from "../../middlewares/validation.middleware";
import {
  createUserSchema,
  updateUserSchema,
} from "../../utils/validation-schema";

const usersRoute = Router();

// get all users
usersRoute.get("/", authorize(["ADMIN"]), usersController.getAllUsers);

// get user by id
usersRoute.get("/:id", authenticate, usersController.getUserById);

// create user
usersRoute.post(
  "/",
  [authenticate, validate(createUserSchema), authorize(["ADMIN"])],
  usersController.createUser,
);

// update user
usersRoute.patch(
  "/:id",
  [
    validate(updateUserSchema),
    authenticate,
    authorize(["ADMIN", "STUDENT", "TEACHER", "USER"]),
  ],
  usersController.updateUserById,
);

// delete user
usersRoute.delete(
  "/:id",
  [authenticate, authorize(["ADMIN"])],
  usersController.deleteUserById,
);

export default usersRoute;
