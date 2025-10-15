import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Applied",
      "Under Review",
      "Interview Scheduled",
      "Rejected",
      "Accepted",
    ],
    default: "pending",
    
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});
const Application = mongoose.model("Application", applicationSchema);
export default Application;
