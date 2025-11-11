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
    job.applicants.push(newApplication._id);
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

const getAllAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await applicationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        message: "No applications found",
      });
    }
    return res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.error("Error in fetching applications:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await jobModel.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant", options: { sort: { createdAt: -1 } } },
    });

    if (!job || job.length === 0) {
      return res.status(404).json({
        message: "No applications found",
      });
    }
    return res.status(200).json({
      message: "All applications fetched successfully",
      job,
    });
  } catch (error) {
    console.error("Error in fetching all applications:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.params;
    const application = await applicationModel.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }
    application.status = status;
    await application.save();
    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error in updating application status:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
export { applyJob, getAllAppliedJobs, getAllApplicants, updateApplicationStatus };
