import companyModel from "../models/company.model.js";

const registerCompany = async (req, res) => {
  const { companyName, description, website, location, userId, logo } =
    req.body;
  try {
    if (!companyName || !description) {
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

    const newCompany = await companyModel.create({
      companyName,
      userId: req.id,
      description,
      website,
      location,
      logo,
    });
    return res.status(201).json({
      message: "Company registered successfully",
      newCompany,
    });
  } catch (error) {
    console.error("Error in company registration:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await companyModel.find({ userId });
    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found",
      });
    }
    return res.status(200).json({
      message: "Companies fetched successfully",
      companies,
    }); 
  } catch (error) {
    console.error("Error in fetching companies:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }
    res.status(200).json({
      message: "Company fetched successfully",
      company,
    });
  } catch (error) {
    console.error("Error in fetching company by ID:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { companyName, description, website, location, logo } = req.body;

    const updatedCompany = await companyModel.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        description,
        website,
        location,
        logo,
      },
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }
    res.status(200).json({
      message: "Company updated successfully",
      updatedCompany,
    });
  } catch (error) {
    console.error("Error in updating company:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export { registerCompany, getAllCompanies, getCompanyById, updateCompany };
