import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Category from "../models/categoryModel";



export default class CategoryController {
  static createCategory = async (req: Request, res: Response): Promise<void> => {
    const { name} = req.body;
    console.log("name is ", name);


    try {
      // Check if the username or email already exists
      const existingCategory = await Category.findOne({
        $or: [{ name }],
      });

      if (existingCategory) {
        // If username or email already exists, return an error response
        res.status(400).json({ error: "Category already exists" });
        return;
      }


      // If username and email are unique, create the new user
      const category = await Category.create({
        name
      });

      res.status(200).json(category);
    } catch (error:any) {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error", errorr: error.message });
    }
  };

  static readCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await Category.find();
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ error: { error } });
    }
  };

  static readOneCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    res.status(200).json({ data: category, message: "succes", status: 200 });
  };

  static updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name} = req.body;
  
    try {
      const updateFields: any = {}; // Initialize an empty object to store fields to update
  
      // Only add fields to updateFields object if they are provided in the request body
      if (name) updateFields.name = name;
  
      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: "No fields provided to update" });
        return;
      }
  
      const category = await Category.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      res.status(200).json(category);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };
  

  static deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted succefully" });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

}