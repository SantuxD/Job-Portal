import userModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });
    await newUser.save();

    res.status(201).json({
      message: `${fullName} registered successfully `,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({
      message: "Server error",
    });
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

    let user = await userModel.findOne({ email });
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

    if (user.role !== role) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }

    const token = await jwt.sign(
      {
        userId: user._id,
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
        sameSite: "strict",
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
    const userId = req.user.userId;
    // console.log(userId);
    // console.log(req.body);
    // console.log("req.method:", req.method);
    // console.log("req.headers:", req.headers);
    // console.log("req.body:", req.body);
    // console.log("req.cookies:", req.cookies);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body missing" });
    }

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

    if (fullName) {
      user.fullName = fullName;
    }
    if (email) {
      user.email = email;
    }
    if (phoneNumber) {
      user.profile.phoneNumber = phoneNumber;
    }
    if (bio) {
      user.profile.bio = bio;
    }
    if (skills) {
      user.profile.skills = skillsArray;
    }
    if (resume) {
      user.profile.resume = resume;
    }
    if (profilePicture) {
      user.profile.profilePicture = profilePicture;
    }
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { registerUser, loginUser, logoutUser, updateUserProfile };
