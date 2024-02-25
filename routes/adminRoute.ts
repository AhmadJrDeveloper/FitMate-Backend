import express, { Router } from "express";
import AdminController from "../controllers/adminController";
const AdminRouter: Router = express.Router();
import { authenticate } from "../middleware/auth";

AdminRouter.post("", authenticate,AdminController.createAdmin);
AdminRouter.post("/login", AdminController.login);
AdminRouter.post("/logout", AdminController.logout);
AdminRouter.get("/", authenticate,AdminController.readAdmin);
AdminRouter.get("/:id", authenticate,AdminController.readOneAdmin);
AdminRouter.put("/:id", authenticate,AdminController.updateAdmin);
AdminRouter.delete("/:id", authenticate,AdminController.deleteAdmin);

export default AdminRouter;
