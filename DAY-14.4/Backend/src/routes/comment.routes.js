const express = require("express");
const commentRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const commentController = require("../controllers/comment.controller");

commentRouter.post(
  "/:postId/comments",
  authMiddleware.identifyUser,
  commentController.createCommentController,
);

commentRouter.post(
  "/:postId/comments/:parentId/replies",
  authMiddleware.identifyUser,
  commentController.replyToCommentController,
);

commentRouter.get(
  "/:postId/comments",
  authMiddleware.identifyUser,
  commentController.getCommentsForPostController,
);

commentRouter.delete(
  "/comments/:commentId",
  authMiddleware.identifyUser,
  commentController.deleteCommentController,
);

module.exports = commentRouter;
