import express, { Router } from "express";
import ScheduleController from "../controllers/scheduleController";
const ScheduleRouter: Router = express.Router();

ScheduleRouter.post("", ScheduleController.createSchedule);
ScheduleRouter.get("/", ScheduleController.readSchedule);
ScheduleRouter.get("/:id", ScheduleController.readOneSchedule);
ScheduleRouter.put("/:id", ScheduleController.updateSchedule);
ScheduleRouter.delete("/:id", ScheduleController.deleteSchedule);

export default ScheduleRouter;
