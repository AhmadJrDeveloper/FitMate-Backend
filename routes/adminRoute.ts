import express, { Router } from "express";
import AdminController from "../controllers/adminController";
const AdminRouter: Router = express.Router();

AdminRouter.post("", AdminController.createAdmin);
AdminRouter.post("/login", AdminController.login);
AdminRouter.post("/logout", AdminController.logout);
AdminRouter.get("/", AdminController.readAdmin);
AdminRouter.get("/:id", AdminController.readOneAdmin);
AdminRouter.put("/:id", AdminController.updateAdmin);
AdminRouter.delete("/:id", AdminController.deleteAdmin);

export default AdminRouter;
