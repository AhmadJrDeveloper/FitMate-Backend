import express, { Router } from "express";
import CategoryController from "../controllers/categoryController";
const CategoryRouter: Router = express.Router();

CategoryRouter.post("", CategoryController.createCategory);
CategoryRouter.get("/", CategoryController.readCategory);
CategoryRouter.get("/:id", CategoryController.readOneCategory);
CategoryRouter.put("/:id", CategoryController.updateCategory);
CategoryRouter.delete("/:id", CategoryController.deleteCategory);

export default CategoryRouter;
