const express = require("express")
const authRouter = express.Router();
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware");

// registration
authRouter.post("/register", authController.registerController)

//login
authRouter.post("/login", authController.loginController)

//get-me -> to get user's data {private}
authRouter.get("/get-me", authMiddleware.identifyUser, authController.getMeController)

//logout
authRouter.post("/logout", authController.logoutController)

//search users
authRouter.get("/search", authMiddleware.identifyUser, authController.searchUsersController)

module.exports = authRouter