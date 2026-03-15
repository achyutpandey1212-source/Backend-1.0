const express = require("express");
const userProfileRouter = express.Router();
const { userProfileController, getUserProfileController } = require("../controllers/userProfile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer  = require('multer')
const upload = multer({storage: multer.memoryStorage()})

userProfileRouter.post("/", upload.single("profilepic"),authMiddleware.identifyUser, userProfileController);

userProfileRouter.get("/:userId", authMiddleware.identifyUser, getUserProfileController);

module.exports = userProfileRouter;
