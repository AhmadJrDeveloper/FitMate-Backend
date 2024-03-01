import { Request, Response } from "express";
import mongoose from "mongoose";
import Exercise from "../models/exerciseModel";
import Category from "../models/categoryModel";
import fs from 'fs';


export default class ExerciseController {
    static createExercise = async (req: Request, res: Response): Promise<void> => {
        const { name, description, category } = req.body;
        const file = req.file;
    
        try {
          // Check if the exercise already exists
          const existingExercise = await Exercise.findOne({
            $or: [{ name }],
          });
    
          if (existingExercise) {
            res.status(400).json({ error: "Exercise already exists" });
            return;
          }

          if (!file) {
            res.status(400).json({ error: "No file was uploaded" });
            return;
          }
    
          const exercise = await Exercise.create({
            name,
            gif: file.filename, 
            description,
            category
          });
    
          res.status(200).json(exercise);
        } catch (error: any) {
          res.status(500).json({ error: "Internal Server Error", err: error.message });
        }
      };

  static readExercise = async (req: Request, res: Response): Promise<void> => {
    try {
      const exercise  = await Exercise.find().populate('category');
      res.status(200).json(exercise );
    } catch (error) {
      res.status(400).json({ error: { error } });
    }
  };

  static readOneExercise = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    const exercise = await Exercise.findById(id).populate('category');
    if (!exercise) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    res.status(200).json({ data: exercise, message: "succes", status: 200 });
  };

  static updateExercise = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, category } = req.body;
    const file = req.file; // Access the uploaded file if available
  
    try {
      const updateFields: any = {}; // Initialize an empty object to store fields to update
  
      // Only add fields to updateFields object if they are provided in the request body
      if (name) updateFields.name = name;
      if (description) updateFields.description = description;
      if (category) updateFields.category = category;
  
      // If a file was uploaded, update the gif field with the new filename
      if (file) {
        // Retrieve the existing exercise to get the current gif filename
        const exercise = await Exercise.findById(id);
        if (exercise && exercise.gif) {
          // Delete the old gif file
          fs.unlink(`./uploads/${exercise.gif}`, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Old gif file was deleted`);
            }
          });
        }
        updateFields.gif = file.filename;
      }
  
      if (Object.keys(updateFields).length ===  0) {
        res.status(400).json({ error: "No fields provided to update" });
        return;
      }
  
      // Find the exercise by ID and update it with the new fields
      const updatedExercise = await Exercise.findByIdAndUpdate(id, updateFields, {
        new: true, // Return the updated document
      });
  
      if (!updatedExercise) {
        res.status(404).json({ error: "Exercise not found" });
        return;
      }
  
      res.status(200).json(updatedExercise);
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error", err: error.message });
    }
  };

  static getExercisesByCategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryName } = req.params;
    console.log(categoryName);
     
    try {
       // Find category by name
       const category = await Category.findOne({ name: categoryName });
       
       if (!category) {
         res.status(404).json({ message: "Category not found" });
         return;
       }

       // Find exercises by category ID
       const exercises = await Exercise.find({ category: category._id }).populate('category');
       
       if (exercises.length === 0) {
         res.status(404).json({ message: "No exercises found for the given category" });
         return;
       }
   
       res.status(200).json(exercises);
    } catch (error: any) {
       res.status(500).json({ error: "Internal Server Error", err: error.message });
    }
   };
   
  
  

  static deleteExercise = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      // Retrieve the exercise to get the gif filename
      const exercise = await Exercise.findById(id);
      if (exercise && exercise.gif) {
        // Delete the gif file
        fs.unlink(`./uploads/${exercise.gif}`, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Gif file was deleted`);
          }
        });
      }
      // Delete the exercise from the database
      await Exercise.findByIdAndDelete(id);
      res.status(200).json({ message: "Exercise and associated gif deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  

}