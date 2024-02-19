import express, { Router } from "express";
import GoalController from "../controllers/goalController";
const GoalRouter: Router = express.Router();

GoalRouter.post("", GoalController.createGoal);
GoalRouter.get("/", GoalController.readGoal);
GoalRouter.get("/:id", GoalController.readOneGoal);
GoalRouter.put("/:id", GoalController.updateGoal);
GoalRouter.delete("/:id", GoalController.deleteGoal);

export default GoalRouter;
