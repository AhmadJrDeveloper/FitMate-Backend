import express, { Router } from "express";
import UserController from "../controllers/userController";
const UserRouter: Router = express.Router();

UserRouter.post("", UserController.createUser);
UserRouter.post("/login", UserController.login);
UserRouter.post("/logout", UserController.logout);
UserRouter.get("/", UserController.readUser);
UserRouter.get("/:id", UserController.readOneUser);
UserRouter.put("/:id", UserController.updateUser);
UserRouter.delete("/:id", UserController.deleteUser);

export default UserRouter;
