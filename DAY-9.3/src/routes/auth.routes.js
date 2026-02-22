const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

// REGISTRATION PROCESS

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "user already exists with the email...",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex")

  const user = await userModel.create({
    name,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.status(201).json({
    message: "user registered successfully...",
    user,
  });
});

// LOGIN PROCESS

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex")

  const isPassword = user.password === hash;

  if (!isPassword) {
    return res.status(401).json({
      message: "invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "user logged in...",
  });
});

module.exports = authRouter;
