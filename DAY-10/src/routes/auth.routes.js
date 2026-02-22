const express = require("express");
const authRouter = express.Router();
const userModel = require("../models/user.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// REGISTER METHOD

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "user already exists...",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

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
    { expiresIn: "1h" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "user created successfully...",
    user,
  });
});

// TOKEN READER

authRouter.get("/get-me", async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  res.json({
    name: user.name,
    email: user.email,
  });
});

// LOGIN METHOD

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "user not registered...",
    });
  }

  const hash = crypto.createHash("md5").update(password).digest("hex");

  const isPasswordMatched = user.password === hash;

  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid Password...",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("token", token);

  res.json({
    message: "user logged in...",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = authRouter;
