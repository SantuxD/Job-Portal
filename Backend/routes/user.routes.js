import express from "express";
import { registerUser, loginUser, logoutUser, updateUserProfile } from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile/update").put(authMiddleware,updateUserProfile);

export default router;