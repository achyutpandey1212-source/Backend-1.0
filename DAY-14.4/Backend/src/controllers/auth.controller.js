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
  const userId = req.user.id;
  const user = await userModel.findById(userId);
  const userDetails = await userProfileModel.findById(userId);

  res.status(200).json({
    user: {
      username: user.username,
      email: user.email,
      bio: userDetails.bio,
      profileImage: userDetails.profileImg,
    },
  });
}

module.exports = { registerController, loginController, getMeController };
