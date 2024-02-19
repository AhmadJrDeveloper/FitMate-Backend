import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },
    current_weight:{
        type:Number,
        required: true
    },
    height:{
        type:Number,
        required: true
    },
    weight_goal:{
        type:Number,
        required: true
    }
});

const Goal = mongoose.model('goals', GoalSchema);

export default Goal;