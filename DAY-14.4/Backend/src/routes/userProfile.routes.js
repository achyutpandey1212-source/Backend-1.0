const express = require("express");
const userProfileRouter = express.Router();
const userProfileController = require("../controllers/userProfile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer  = require('multer')
const upload = multer({storage: multer.memoryStorage()})

userProfileRouter.post("/", upload.single("profilepic"),authMiddleware.identifyUser, userProfileController);

module.exports = userProfileRouter;
