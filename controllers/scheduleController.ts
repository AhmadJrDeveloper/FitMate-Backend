import { Request, Response } from "express";
import mongoose from "mongoose";
import Schedule from "../models/scheduleModel";

export default class ScheduleController {
  static createSchedule = async (req: Request, res: Response): Promise<void> => {
    const { user,date,exercise} = req.body;


    try {
      const schedule = await Schedule.create({
        user,date,exercise
      });

      res.status(200).json(schedule);
    } catch (error:any) {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error", errorr: error.message });
    }
  };

  static readSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
      const schedule = await Schedule.find().populate('user').populate('exercise');
      res.status(200).json(schedule);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

  static readOneSchedule = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    const schedule = await Schedule.findById(id).populate('user');
    if (!schedule) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    res.status(200).json({ data: schedule, message: "succes", status: 200 });
  };

  static updateSchedule = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {date,exercise} = req.body;
  
    try {
      const updateFields: any = {};
  
      if (date) updateFields.date = date;
      if (exercise) updateFields.exercise = exercise;
  
      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: "No fields provided to update" });
        return;
      }
  
      const schedule = await Schedule.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      res.status(200).json(schedule);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };
  

  static deleteSchedule = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await Schedule.findByIdAndDelete(id);
      res.status(200).json({ message: "Schedule deleted succefully" });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

}