import express from "express";
import {
  registerCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
} from "../controller/company.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();

router.route("/register").post(authMiddleware, registerCompany);
router.route("/get").get(authMiddleware, getAllCompanies);
router.route("/get/:companyId").get(authMiddleware, getCompanyById);
router.route("/update/:id").put(authMiddleware, updateCompany);

export default router;