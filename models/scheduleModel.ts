import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    exercise:[{
        exercise_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"exercises",
            required: true
        },
        sets:{
            type:Number,
            required: true
        },
        reps:{
            type:Number,
            required: true
        }
    }]
})


const Schedule = mongoose.model('schedules', scheduleSchema);

export default Schedule