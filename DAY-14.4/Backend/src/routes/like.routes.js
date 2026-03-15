const express = require("express");
const likeRouter = express.Router();
const likeController = require("../controllers/like.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//like a post
likeRouter.post(
  "/:postId/like",
  authMiddleware.identifyUser,
  likeController.likePostController,
);

// unlike a post
likeRouter.delete(
  "/:postId/unlike",
  authMiddleware.identifyUser,
  likeController.unlikePostController,
);

module.exports = likeRouter;
