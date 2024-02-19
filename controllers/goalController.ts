import { Request, Response } from "express";
import mongoose from "mongoose";
import Goal from "../models/goalModel";


export default class GoalController {
  static createGoal = async (req: Request, res: Response): Promise<void> => {
    const { user,current_weight,height,weight_goal} = req.body;


    try {
      const goal = await Goal.create({
        user,current_weight,height,weight_goal
      });

      res.status(200).json(goal);
    } catch (error:any) {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error", errorr: error.message });
    }
  };

  static readGoal = async (req: Request, res: Response): Promise<void> => {
    try {
      const goal = await Goal.find().populate('user');
      res.status(200).json(goal);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

  static readOneGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    const goal = await Goal.findById(id).populate('user');
    if (!goal) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    res.status(200).json({ data: goal, message: "succes", status: 200 });
  };

  static updateGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {current_weight,height,weight_goal} = req.body;
  
    try {
      const updateFields: any = {};
  
      if (current_weight) updateFields.current_weight = current_weight;
      if (height) updateFields.height = height;
      if (weight_goal) updateFields.weight_goal = weight_goal;
  
      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: "No fields provided to update" });
        return;
      }
  
      const goal = await Goal.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      res.status(200).json(goal);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };
  

  static deleteGoal = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await Goal.findByIdAndDelete(id);
      res.status(200).json({ message: "Goal deleted succefully" });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

}