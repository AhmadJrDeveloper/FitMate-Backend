import express, { Router } from "express";
import ExerciseController from "../controllers/exerciseController";
import upload from "../middleware/multer";
const ExerciseRouter: Router = express.Router();
ExerciseRouter.get("/exercise/:categoryName", ExerciseController.getExercisesByCategory);

ExerciseRouter.post("", upload.single('gif'), ExerciseController.createExercise);
ExerciseRouter.get("/", ExerciseController.readExercise);
ExerciseRouter.get("/:id", ExerciseController.readOneExercise);
ExerciseRouter.put("/:id", upload.single('gif'), ExerciseController.updateExercise);
ExerciseRouter.delete("/:id", ExerciseController.deleteExercise);

export default ExerciseRouter;
