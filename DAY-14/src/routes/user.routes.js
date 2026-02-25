const express = require("express");
const userRouter = express.Router();
const toggleFollowingController = require("../controllers/user.controller")

// follower & following feature

userRouter.post("/:id/follow", toggleFollowingController)

module.exports = userRouter;
