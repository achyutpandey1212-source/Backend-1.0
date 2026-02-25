const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer")
const upload = multer({storage: multer.memoryStorage()})

// creating a post

postRouter.post("/", upload.single("image"), postController.createPostController);


// getting feed

postRouter.get("/", postController.getFeedController)

// getting user's posts

postRouter.get("/me", postController.getUserPostsController)

// getting single post

postRouter.get("/:id", postController.getSinglePostController)

// like feature

postRouter.post("/:id/like", postController.toggleLikeController)

module.exports = postRouter;
