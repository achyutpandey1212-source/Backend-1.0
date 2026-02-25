const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");

//register

authRouter.post("/register", authController.registerController);

//login

authRouter.post("/login", authController.loginController);

module.exports = authRouter;
