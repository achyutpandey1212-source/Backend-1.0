const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const userProfileModel = require("../models/userProfile.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller
async function registerController(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(401).json({
      message:
        isUserAlreadyExist.email == email
          ? "email already registered"
          : "Username already taken",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: `${user.username} registered successfully...`,
    user,
  });
}

// login controller
async function loginController(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (!user) {
    return (
      res.status(401),
      json({
        message: "User is not registered... access denied",
      })
    );
  }

  const isPassword = bcrypt.compare(password, user.password);

  if (!isPassword) {
    return res.status(401).json({
      message: "Invalid password...",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: `${user.username} logged in`,
  });
}

//get-me controller
async function getMeController(req, res) {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("username email");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userDetails = await userProfileModel.findOne({ user: userId });
    const hasProfile = !!userDetails;

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: userDetails?.bio || "",
        profileImage:
          userDetails?.profileImg ||
          "https://ik.imagekit.io/1gileoynr/default-profile-picture-avatar-user-icon-vector-46389216.avif?updatedAt=1771771461998",
        followerCount: userDetails?.followerCount || 0,
        followingCount: userDetails?.followingCount || 0,
        hasProfile,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
}

//logout controller
async function logoutController(req, res) {
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logged out successfully",
  });
}

//search users controller
async function searchUsersController(req, res) {
  const { query } = req.query;
  const currentUserId = req.user.id;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({
      message: "Search query must be at least 2 characters",
    });
  }

  const users = await userModel.find({
    username: { $regex: query.trim(), $options: 'i' },
    _id: { $ne: currentUserId } // Exclude current user
  }).select('username').limit(10);

  return res.status(200).json({
    message: "Users found",
    users,
  });
}

module.exports = { registerController, loginController, getMeController, logoutController, searchUsersController };
