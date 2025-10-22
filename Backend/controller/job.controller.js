import jobModel from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      company,
      location,
      salary,
      position,
      experience,
      jobType,
    } = req.body;
    if (
      !title ||
      !description ||
      !requirements ||
      !company ||
      !location ||
      !salary ||
      !position ||
      !experience ||
      !jobType 
     
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await jobModel.create({
      title,
      description,
      requirements,
      company,
      location,
      salary,
      position,
      postedBy: req.id,
      experience,
      jobType,
    });
    return res.status(201).json({
      message: "Job created successfully",
      newJob,
    });
  } catch (error) {
    console.error("Error in creating job:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const experienceNumber = Number(keyword);
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        { jobType: { $regex: keyword, $options: "i" } },
        ...(isNaN(experienceNumber) ? [] : [{ experience: experienceNumber }]),
        { position: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await jobModel.find(query);
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found",
      });
    }
    return res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error in fetching jobs:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getJobById = async (req, res) => {
    try {
    const { jobId } = req.params;
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }
    res.status(200).json({
      message: "Job fetched successfully",
      job,
    });
  }
    catch (error) {
    console.error("Error in fetching job by ID:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAdminCreatedJobs = async (req, res) => {
    try {
    const adminId = req.id;
    const jobs = await jobModel.find({ postedBy: adminId });
    if (!jobs || jobs.length === 0) {
        return res.status(404).json({
        message: "No jobs found for this admin",
      });
    }
    return res.status(200).json({
      message: "Admin jobs fetched successfully",
      jobs,
    });
  }
    catch (error) {
    console.error("Error in fetching admin jobs:", error);
    res.status(500).json({  
        message: "Server error",
    });
  }
};

