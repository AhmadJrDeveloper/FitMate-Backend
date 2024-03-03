import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      firstName: { 
        type: String,
        required: true
      },
      lastName: { 
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ["trainer", "admin"]
      },
      image:{
        type: String,
        required: true
      },
      insta:{
        type: String,
      },
      facebook:{
        type: String,
      }
});

// Static method for comparing passwords
adminSchema.statics.comparePassword = async function(candidatePassword, hashedPassword) {
  try {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  } catch (error) {
    throw error;
  }
};

const Admin = mongoose.model("admins", adminSchema);

export default Admin;
