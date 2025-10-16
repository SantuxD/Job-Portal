import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({
      message: `User registered successfully ${fullName}`,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email and password and role are required",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    res.status(200).json({
      message: "Login successful",
      user,
    });

    if (user.role !== role) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }

    const token = await jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: strict,
      })
      .json({
        message: `Welcome back, ${user.fullName}`,
        user,
      });
  } catch (error) {
    console.error("Error in user login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in user logout:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      fullName,
      email,
      phoneNumber,
      bio,
      skills,
      resume,
      profilePicture,
    } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.profile.phoneNumber = phoneNumber || user.profile.phoneNumber;
    user.profile.bio = bio || user.profile.bio;
    user.profile.skills = skillsArray || user.profile.skills;
    user.profile.resume = resume || user.profile.resume;
    user.profile.profilePicture = profilePicture || user.profile.profilePicture;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, loginUser, logoutUser, updateUserProfile };
