const followModel = require("../models/follow.model");
const userProfileModel = require("../models/userProfile.model");

//send follow request controller
async function sendFollowRequestController(req, res) {
  const followerId = req.user.id;
  const followingId = req.params.targetUserId;

  if (followerId == followingId) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  const targetUser = await userProfileModel.findOne({ user: followingId });
  if (!targetUser) {
    return res.status(404).json({
      message: "User u want to follow not found",
    });
  }

  const isPrivate = targetUser.isPrivate; // user to be followed has private or public account

  const isAlreadyFollower = await followModel.findOne({
    follower: followerId,
    following: followingId,
  });

  //for public/private accounts
  if (!isPrivate) {
    if (isAlreadyFollower) {
      if (isAlreadyFollower.status == "accepted") {
        return res.status(400).json({
          message: "Already following this user",
        });
      } else {
        await followModel.findOneAndUpdate(
          { follower: followerId, following: followingId },
          { status: "accepted" },
        );
        const follower = await userProfileModel.updateOne(
          { user: followerId },
          { $inc: { followingCount: 1 } },
        );
        const following = await userProfileModel.updateOne(
          { user: followingId },
          { $inc: { followerCount: 1 } },
        );
        return res.status(201).json({
          message: "started following...",
        });
      }
    } else {
      const follower = await userProfileModel.findOne({ user: followerId });
      const following = await userProfileModel.findOne({ user: followingId });
      await followModel.create({
        follower: followerId,
        following: followingId,
        status: "accepted",
      });
      await userProfileModel.updateOne(
        { user: followerId },
        { $inc: { followingCount: 1 } },
      );
      await userProfileModel.updateOne(
        { user: followingId },
        { $inc: { followerCount: 1 } },
      );
      return res.status(201).json({
        message: "created new doc and started following...",
      });
    }
  } else {
    if (!isAlreadyFollower) {
      await followModel.create({
        follower: followerId,
        following: followingId,
        status: "pending",
      });

      return res.status(201).json({
        message: "request sent successfully...",
      });
    } else {
      if (isAlreadyFollower.status == "accepted") {
        return res.status(400).json({
          message: "You are already following user",
        });
      } else if (isAlreadyFollower.status == "pending") {
        return res.status(201).json({
          message: "request is pending",
        });
      } else {
        await followModel.findOneAndUpdate(
          { follower: followerId, following: followingId },
          { status: "pending" },
        );

        return res.status(201).json({
          message: "request sent successfully...",
        });
      }
    }
  }
}

//accept follow request controller
async function acceptFollowRequestController(req, res) {
  const followId = req.params.followId;
  const currentUserId = req.user.id;
  const request = await followModel.findById(followId);

  if (!request) {
    return res.status(404).json({
      message: "Follow request not found",
    });
  }

  if (currentUserId !== request.following.toString()) {
    return res.status(403).json({
      message: "Not allowed to accept this request",
    });
  }

  if (request.status == "accepted") {
    return res.status(409).json({
      message: "Request already accepted",
    });
  } else if (request.status == "rejected") {
    return res.status(409).json({
      message: "Request already rejected",
    });
  } else {
    request.status = "accepted";
    await request.save();

    await userProfileModel.updateOne(
      { user: request.follower },
      { $inc: { followingCount: 1 } },
    );

    await userProfileModel.updateOne(
      { user: request.following },
      { $inc: { followerCount: 1 } },
    );

    return res.status(201).json({
      message: "follow request accepted",
    });
  }
}

//reject follow request controller
async function rejectFollowRequestController(req, res) {
  const followId = req.params.followId;
  const request = await followModel.findById(followId);
  const currentUserId = req.user.id;

  if (!request) {
    return res.status(404).json({
      message: "request not found",
    });
  }

  if (currentUserId !== request.following.toString()) {
    return res.status(403).json({
      message: "You are not allowed to reject request",
    });
  }

  if (request.status == "rejected") {
    return res.status(409).json({
      message: "Request already rejected",
    });
  } else if (request.status == "accepted") {
    return res.status(201).json({
      message: "request already accepted. use unfollow to remove this follower",
    });
  } else {
    await followModel.findByIdAndUpdate(followId, { status: "rejected" });

    return res.status(201).json({
      message: "Request rejected successfully...",
    });
  }
}

//unfollow controller
async function unfollowController(req, res) {
  const targetUserId = req.params.unfollowId;
  const currentUserId = req.user.id;

  const isFollowRelationExist = await followModel.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  if (!isFollowRelationExist) {
    return res.status(404).json({
      message: "You are already not a follower",
    });
  } else {
    if (isFollowRelationExist.status !== "accepted") {
      return res.status(403).json({
        message: "Your are not a follower already",
      });
    } else {
      await followModel.deleteOne({ _id: isFollowRelationExist._id });

      await userProfileModel.findOneAndUpdate(
        { user: currentUserId },
        { $inc: { followingCount: -1 } },
      );
      await userProfileModel.findOneAndUpdate(
        { user: targetUserId },
        { $inc: { followerCount: -1 } },
      );

      return res.status(200).json({
        message: "unfollowed successfully...",
      });
    }
  }
}

//get list of followers
async function getFollowerListController(req, res) {
  const userId = req.params.userId;
  const currentUserId = req.user.id;

  if (userId !== currentUserId) {
    return res.status(403).json({
      message: "Unauthorised access",
    });
  }

  const followers = await followModel
    .find({ following: userId, status: "accepted" })
    .populate({ path: "follower", select: "username" });

  if (followers.length === 0) {
    return res.status(404).json({
      message: "You have no followers...",
    });
  }

  return res.status(200).json({
    message: "followers fetched",
    followers,
  });
}

//get list of followings
async function getFollowingListController(req, res) {
  const userId = req.params.userId;
  const currentUserId = req.user.id;

  if (userId !== currentUserId) {
    return res.status(403).json({
      message: "Unauthorised access",
    });
  }

  const followings = await followModel
    .find({ follower: userId, status: "accepted" })
    .populate({ path: "following", select: "username" });

  if (followings.length === 0) {
    return res.status(404).json({
      message: "You dont follow anyone yet...",
    });
  }

  return res.status(200).json({
    message: "followings fetched",
    followings,
  });
}

//get pending requests
async function getPendingRequestsController(req, res) {
  const currentUserId = req.user.id;

  const requests = await followModel
    .find({ following: currentUserId, status: "pending" })
    .populate({ path: "follower", select: "username" });

  if (requests.length == 0) {
    return res.status(404).json({
      message: "No pending requests",
    });
  } else {
    return res.status(200).json({
      message: `${requests.length} pending requests fetched`,
      requests,
    });
  }
}

//check follow status between current user and target user
async function checkFollowStatusController(req, res) {
  const currentUserId = req.user.id;
  const targetUserId = req.params.targetUserId;

  const followRelation = await followModel.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  if (!followRelation) {
    return res.status(200).json({
      status: "not_following",
    });
  }

  return res.status(200).json({
    status: followRelation.status, // "pending" or "accepted"
  });
}

module.exports = {
  sendFollowRequestController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  unfollowController,
  getFollowerListController,
  getFollowingListController,
  getPendingRequestsController,
  checkFollowStatusController,
};
