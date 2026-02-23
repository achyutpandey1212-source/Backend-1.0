const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");

// registration method

authRouter.post("/register", authController.registerController);

// login method

authRouter.post("/login", authController.loginController);

module.exports = authRouter;
