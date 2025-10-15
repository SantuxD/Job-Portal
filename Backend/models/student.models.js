import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
    password: {
    type: String,
    required: true,
  },
    skills: {
    type: [String],
    default: [],
  },
});
