import { Router } from "express";
import usersController from "./user.controller";
import { authorize } from "../../middlewares/authenticate.middleware";

const usersRoute = Router();

usersRoute.get("/", authorize(["ADMIN"]), usersController.getAllUsers);
usersRoute.get("/:id", usersController.getUserById);
usersRoute.put("/:id", usersController.updateUserById);
usersRoute.delete("/:id", usersController.deleteUserById);

export default usersRoute;
