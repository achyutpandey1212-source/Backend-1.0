const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function toggleFollowingController(req, res) {
  const token = req.cookies.token;

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorised user, access denied...",
    });
  }

  const currentUserId = decoded.id;
  const targetUserId = req.params.id;

  if (currentUserId == targetUserId) {
    return res.status(400).json({
      success: false,
      message: "you cannot follow yourself",
    });
  }

  const currentUser = await userModel.findById(currentUserId);
  const targetUser = await userModel.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  console.log(targetUser);

  const alreadyFollowed = targetUser.followers.some(
    (id) => id.toString() === currentUserId.toString(),
  );

  if (!alreadyFollowed) {
    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);
  } else {
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString(),
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId.toString(),
    );
  }

  await targetUser.save();
  await currentUser.save();

  res.status(201).json({
    message: "done...",
    follwed: !alreadyFollowed,
    followerCount: targetUser.followers.length,
    followingCount: currentUser.following.length,
  });
}

module.exports = toggleFollowingController;
