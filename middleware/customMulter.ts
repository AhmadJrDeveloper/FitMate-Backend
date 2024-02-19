// customMiddleware.ts
import { Request, Response, NextFunction } from "express";
import Exercise from "../models/exerciseModel";
import upload from "./multer";

export const checkExerciseExists = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  try {
    const existingExercise = await Exercise.findOne({ name });
    if (existingExercise) {
      return res.status(400).json({ error: "Exercise already exists" });
    }
    next(); // Proceed to the next middleware (Multer) if the exercise does not exist
  } catch (error:any) {
    return res.status(500).json({ error: "Internal Server Error", err: error.message });
  }
};

export const handleFileUpload = upload.single('gif');
