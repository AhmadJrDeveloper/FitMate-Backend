import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose'; // Assuming Admin is a Mongoose model
import jwt, { JwtPayload } from 'jsonwebtoken';
import Admin from '../models/adminModel';
import dotenv from 'dotenv';
dotenv.config();

const verifyToken = async (token: any): Promise<JwtPayload> => {
    const secretString = process.env.SECRET_STRING;
    if (!secretString) {
        throw new Error('Invalid token');
    }

    return jwt.verify(token, secretString) as JwtPayload;
};

// Define a new interface that extends the Request interface
interface AuthenticatedRequest extends Request {
    admin?: Document<any, any>; // Define admin property with the appropriate type
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log();
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const decoded: JwtPayload = await verifyToken(token);

        // Check if 'decoded' contains the 'id' property
        if (!decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Now TypeScript knows that 'decoded' has 'id' property
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Assign the admin object to req.admin
        req.admin = admin;
        console.log(req.admin);
        console.log(admin.type);
        console.log(req.baseUrl);
        console.log(req.path);
        // Check the type of admin
        if (admin.type === 'trainer') {
            // For trainers, restrict access to CRUD operations on the /admins route
            if (req.baseUrl  === "/admins" || req.baseUrl === "/categories") {
                return res.status(403).json({ message: "Trainers are not allowed to perform CRUD operations on "+req.baseUrl });
            }
        }
        

        next();
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

