import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/userModel";
import dotenv from 'dotenv';
dotenv.config();



export default class UserController {
  static createUser = async (req: Request, res: Response): Promise<void> => {
    const { username,firstName,lastName, password } = req.body;

    try {
      // Check if the username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }],
      });

      if (existingUser) {
        // If username or email already exists, return an error response
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // If username and email are unique, create the new user
      const user = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
      
      });

      res.status(200).json(user);
    } catch (error:any) {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error", errorr: error.message });
    }
  };

  static readUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: { error } });
    }
  };

  static readOneUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ data: null, message: "not found", status: 404 });
      return;
    }

    res.status(200).json({ data: user, message: "succes", status: 200 });
  };

  static updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, firstName, lastName, password, dob } = req.body;
  
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
      if (dob) updateFields.dob = dob;
  
      if (Object.keys(updateFields).length === 0) {
        res.status(400).json({ error: "No fields provided to update" });
        return;
      }
  
      const user = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
  
      res.status(200).json(user);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };
  

  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted succefully" });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ username });

      // Check if the user exists and the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }


      if (!process.env.SECRET_STRING) {
        throw new Error("Secret string is not defined in the environment variables.");
      }

      // Sign and generate a JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username,firstName: user.firstName,lastName: user.lastName},
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