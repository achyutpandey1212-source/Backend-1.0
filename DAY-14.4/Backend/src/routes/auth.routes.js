const express = require("express")
const authRouter = express.Router();
const authController = require("../controllers/auth.controller")

// registration
authRouter.post("/register", authController.registerController)

//login
authRouter.post("/login", authController.loginController)

//get-me -> to get user's data {private}
authRouter.get("/get-me", authController.getMeController)

module.exports = authRouter