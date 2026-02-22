const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "user already exists with this email address",
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

  res.cookie("jwt_token", token);

  res.status(201).json({
    message: "user registered",
    user,
    token,
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const hash = crypto.createHash("md5").update(password).digest("hex")

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "user not found with this email address",
    });
  }

  const isPasswordMatched = user.password === hash;

  if (!isPasswordMatched) {
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

  res.status(200).json({
    message: "user logged in",
    user
  })
});

module.exports = authRouter;
