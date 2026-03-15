const postModel = require("../models/post.model");
const userProfileModel = require("../models/userProfile.model");
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

  if (posts.length === 0) {
    return res.status(404).json({
      message: "oops... no posts yet :(",
    });
  }

  return res.status(200).json({
    message: "posts fetched...",
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

  if (posts.length === 0) {
    return res.status(404).json({
      message: "Oops... u haven't posted anything yet",
    });
  }

  return res.status(200).json({
    message: "user's all posts fetched...",
    totalCount: posts.length,
    posts,
  });
}

module.exports = {
  creeatePostController,
  getFeedController,
  getSinglePostController,
  getUsersPostsController,
};
