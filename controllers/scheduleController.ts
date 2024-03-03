import { Request, Response } from "express";
import mongoose from "mongoose";
import Schedule from "../models/scheduleModel";
import Exercise from "../models/exerciseModel";

export default class ScheduleController {
  static createSchedule = async (req: Request, res: Response): Promise<void> => {
    const { name,user,date,exercise} = req.body;


    try {
      const schedule = await Schedule.create({
        name,user,date,exercise
      });

      res.status(200).json(schedule);
    } catch (error:any) {
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
    console.log(id);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: 'User ID is invalid', status: 404 });
      return;
    }
  
    try {
      const schedule = await Schedule.find({ user: id })
        .populate('user')
        .populate({
          path: 'exercise',
          populate: {
            path: 'exercise_id', // Assuming this is the field referencing the exercises collection
            model: Exercise,      // Using the Exercise model
            select: 'name'        // Selecting only the name field
          }
        });
  
      if (!schedule) {
        res.status(404).json({ data: null, message: 'Schedule not found for the given user ID', status: 404 });
        return;
      }
  
      res.status(200).json({ data: schedule, message: 'Success', status: 200 });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error', errorMessage: error.message });
    }
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