const express = require("express");
const bookmarkRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const bookmarkController = require("../controllers/bookmark.controller");

bookmarkRouter.get(
  "/me",
  authMiddleware.identifyUser,
  bookmarkController.getMyBookmarksController,
);

bookmarkRouter.post(
  "/:postId",
  authMiddleware.identifyUser,
  bookmarkController.addBookmarkController,
);

bookmarkRouter.delete(
  "/:postId",
  authMiddleware.identifyUser,
  bookmarkController.removeBookmarkController,
);

module.exports = bookmarkRouter;
