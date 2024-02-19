import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/adminModel";
import dotenv from 'dotenv';
dotenv.config();



export default class AdminController {
  static createAdmin = async (req: Request, res: Response): Promise<void> => {
    const { username,firstName,lastName, password,  type } = req.body;

    try {
      // Check if the username or email already exists
      const existingAdmin = await Admin.findOne({
        $or: [{ username }],
      });

      if (existingAdmin) {
        // If username or email already exists, return an error response
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // If username and email are unique, create the new user
      const admin = await Admin.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        type,
      });

      res.status(200).json(admin);
    } catch (error:any) {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error", errorr: error.message });
    }
  };

  static readAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const admin = await Admin.find();
      res.status(200).json(admin);
    } catch (error) {
      res.status(400).json({ error: { error } });
    }
  };

  static readOneAdmin = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    res.status(200).json({ data: admin, message: "succes", status: 200 });
  };

  static updateAdmin = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, firstName, lastName, password, type } = req.body;
  
    try {
      const updateFields: any = {}; // Initialize an empty object to store fields to update
  
      // Only add fields to updateFields object if they are provided in the request body
      if (username) updateFields.username = username;
      if (firstName) updateFields.firstName = firstName;
      if (lastName) updateFields.lastName = lastName;
      if (password) {
        // Hash the new password if provided
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.password = hashedPassword;
      }
      if (type) updateFields.type = type;
  
      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: "No fields provided to update" });
        return;
      }
  
      const admin = await Admin.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      res.status(200).json(admin);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };
  

  static deleteAdmin = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await Admin.findByIdAndDelete(id);
      res.status(200).json({ message: "Admin deleted succefully" });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      // Find user by email
      const admin = await Admin.findOne({ username });

      // Check if the user exists and the password is correct
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }


      if (!process.env.SECRET_STRING) {
        throw new Error("Secret string is not defined in the environment variables.");
      }

      // Sign and generate a JWT token
      const token = jwt.sign(
        { id: admin._id, username: admin.username, type: admin.type },
        process.env.SECRET_STRING,
        { expiresIn: "24h" }
      );

      // Set token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });

      // Respond with success message and token
      res.status(200).json({ status: 200, message: "Login successful", token });
    } catch (err:any) {
      console.error(err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static logout = (req: Request, res: Response): void => {
    res.clearCookie('token');
    res.status(200).json({message:"logged out successfully"});
  };
}