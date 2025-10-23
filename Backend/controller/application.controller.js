import applicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";

const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }
    const existingApplication = await applicationModel.findOne({
      jobId,
      userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const newApplication = new applicationModel({
      jobId,
      userId,
    });
    job.applications.push(newApplication._id);
    await job.save();
    await newApplication.save();
    res.status(201).json({
      message: "Job application submitted successfully",
    });
  } catch (error) {
    console.error("Error in applying for job:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllApplications = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await applicationModel.find({ userId }).sort({ createdAt: -1 }).populate({path: "job",options:{ sort: { createdAt: -1 } }, populate: { path: "company", {sort: {createdAt: -1} } } });

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                message: "No applications found",
            });
        }
        return res.status(200).json({
            message: "Applications fetched successfully",
            applications,
        });



    }catch (error) {
    console.error("Error in fetching applications:", error);
    res.status(500).json({
        message: "Server error",
    });
    }
};


export { applyJob };