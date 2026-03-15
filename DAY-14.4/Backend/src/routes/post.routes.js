const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// create post
postRouter.post(
  "/",
  upload.single("image"),
  authMiddleware.identifyUser,
  postController.creeatePostController,
);

// get all posts - feed
postRouter.get(
  "/feed",
  authMiddleware.identifyUser,
  postController.getFeedController,
);

// get single post
postRouter.get(
  "/:id/post",
  authMiddleware.identifyUser,
  postController.getSinglePostController,
);

// get user's all posts
postRouter.get(
  "/me/:id",
  authMiddleware.identifyUser,
  postController.getUsersPostsController,
);

module.exports = postRouter;
