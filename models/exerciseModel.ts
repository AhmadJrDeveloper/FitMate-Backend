import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gif: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'categories',
        required: true
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

export default Exercise;
