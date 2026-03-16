const postModel = require("../models/post.model");
const userProfileModel = require("../models/userProfile.model");
const commentModel = require("../models/comment.model");
const likeModel = require("../models/like.model");
const bookmarkModel = require("../models/bookmark.model");
const ImageKit = require("@imagekit/nodejs");
const authMiddleware = require("../middlewares/auth.middleware");
const jwt = require("jsonwebtoken");

//creating a post controller
async function creeatePostController(req, res) {
  console.log(req.body, req.file);

  const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });

  const base64string = req.file.buffer.toString("base64");

  const file = await client.files.upload({
    file: base64string,
    fileName: req.file.originalname,
    folder: "insta-posts",
  });

  const userProfile = await userProfileModel.findOne({ user: req.user.id });

  if (!userProfile) {
    return res.status(400).json({
      message: "User Profile not found. please complete your profile first.",
    });
  }

  const post = await postModel.create({
    title: req.body.title,
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
    userProfile: userProfile._id,
  });

  return res.status(200).json({
    message: "post uploaded...",
    post,
  });
}

//see all posts - feed controller
async function getFeedController(req, res) {
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;
  const skip = (page - 1) * limit;

  const posts = await postModel
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate([
      { path: "user", select: "username" },
      { path: "userProfile", select: "profileImg" },
    ]);

  return res.status(200).json({
    message: posts.length === 0 ? "oops... no posts yet :(" : "posts fetched...",
    posts,
  });
}

//see single post controller
async function getSinglePostController(req, res) {
  const postId = req.params.id;

  const post = await postModel.findById(postId).populate([
    { path: "user", select: "username" },
    { path: "userProfile", select: "profileImg" },
  ]);

  if (!post) {
    return res.status(404).json({
      message: "Post not found...",
    });
  }

  return res.status(200).json({
    message: "post fetched",
    post,
  });
}

//get user's all posts controller
async function getUsersPostsController(req, res) {
  const userId = req.params.id;

  const posts = await postModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .populate([
      { path: "user", select: "username" },
      { path: "userProfile", select: "profileImg" },
    ]);

  return res.status(200).json({
    message:
      posts.length === 0
        ? "Oops... u haven't posted anything yet"
        : "user's all posts fetched...",
    totalCount: posts.length,
    posts,
  });
}

// update post controller
async function updatePostController(req, res) {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (String(post.user) !== String(userId)) {
    return res.status(403).json({
      message: "Not allowed to update this post",
    });
  }

  const updates = {};
  if (typeof req.body.title === "string") {
    updates.title = req.body.title.trim();
  }
  if (typeof req.body.caption === "string") {
    updates.caption = req.body.caption.trim();
  }

  const updated = await postModel.findByIdAndUpdate(postId, updates, {
    new: true,
  });

  return res.status(200).json({
    message: "post updated",
    post: updated,
  });
}

// delete post controller
async function deletePostController(req, res) {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (String(post.user) !== String(userId)) {
    return res.status(403).json({
      message: "Not allowed to delete this post",
    });
  }

  await postModel.deleteOne({ _id: postId });
  await commentModel.deleteMany({ post: postId });
  await likeModel.deleteMany({ post: postId });
  await bookmarkModel.deleteMany({ post: postId });

  return res.status(200).json({
    message: "post deleted",
  });
}

module.exports = {
  creeatePostController,
  getFeedController,
  getSinglePostController,
  getUsersPostsController,
  updatePostController,
  deletePostController,
};
