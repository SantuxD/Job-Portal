import companyModel from "../models/company.model.js";

const registerCompany = async (req, res) => {
  const { companyName, description, website, location, userId, logo } =
    req.body;
  try {
    if (!companyName || !description || !userId) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const existingCompany = await companyModel.findOne({ companyName });

    if (existingCompany) {
      return res.status(409).json({
        message: "Company already exists",
      });
    }

    existingCompany = await companyModel.create({
      name: companyName,
      userId: userId,
    });
  } catch (error) {
    console.error("Error in company registration:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
