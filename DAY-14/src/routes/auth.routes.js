const express = require("express");
const mongoose = require("mongoose");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller")

// REGISTRATION

authRouter.post("/register", authController.registerController);

// LOGIN

authRouter.post("/login", authController.loginController);

module.exports = authRouter;
