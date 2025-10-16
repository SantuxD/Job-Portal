import express from "express";
import { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile } from "../controller/user.controller.js";


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile/update").get(getUserProfile).put(updateUserProfile);
