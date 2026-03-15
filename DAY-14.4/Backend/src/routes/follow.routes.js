const express = require("express");
const followRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const followController = require("../controllers/follow.controller");

//send follow request
followRouter.post(
  "/:targetUserId/follow",
  authMiddleware.identifyUser,
  followController.sendFollowRequestController,
);

//accept follow request
followRouter.patch(
  "/:followId/accept",
  authMiddleware.identifyUser,
  followController.acceptFollowRequestController,
);

//accept reject request
followRouter.patch(
  "/:followId/reject",
  authMiddleware.identifyUser,
  followController.rejectFollowRequestController,
);

//unfollow
followRouter.delete(
  "/:unfollowId/unfollow",
  authMiddleware.identifyUser,
  followController.unfollowController,
);

//get followers list
followRouter.get(
  "/:userId/followers",
  authMiddleware.identifyUser,
  followController.getFollowerListController,
);

//get following list
followRouter.get(
  "/:userId/followings",
  authMiddleware.identifyUser,
  followController.getFollowingListController,
);

//get all pending requests list
followRouter.get(
  "/requests",
  authMiddleware.identifyUser,
  followController.getPendingRequestsController,
);

module.exports = followRouter;
