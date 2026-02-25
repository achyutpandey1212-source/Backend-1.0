const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

//create post controller
async function createPostController(req, res) {
  console.log(req.body, req.file);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised user",
    });
  }

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorised user, access denied...",
    });
  }

  const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  const base64String = req.file.buffer.toString("base64");

  const file = await client.files.upload({
    file: base64String,
    fileName: req.file.originalname,
    folder: "/posts",
  });

  const newPost = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: decoded.id,
  });

  res.status(201).json({
    message: "uploaded",
  });
}

//get feed controller
async function getFeedController(req, res) {
  const token = req.cookies.token;

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401).json({
      message: "Unauthorised user, access denied...",
    });
  }

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;
  let skip = (page - 1) * limit;

  try {
    const posts = await postModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({
      message: "something went wrong...",
    });
  }
}

//get single post controller
async function getSinglePostController(req, res) {
  const postId = req.params.id;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "post not found",
    });
  }

  res.status(200).json({
    message: "post found",
    post,
  });
}


//get user's posts controller
async function getUserPostsController(req, res) {
  const token = req.cookies.token;

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    (res.status(401),
      json({
        message: "Unauthorised user, access denied...",
      }));
  }

  const userPosts = await postModel
    .find({ user: decoded.id })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    message: "posts fetched",
    userPosts,
  });
}

//like feature
async function toggleLikeController(req, res) {
  const token = req.cookies.token;

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorised user, access denied...",
    });
  }

  console.log(decoded);

  const postId = req.params.id;
  const userId = decoded.id;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({
      message: "post not found...",
    });
  }

  const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId.toString(),
  );

  if (!alreadyLiked) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  }

  await post.save();

  res.status(200).json({
    liked: !alreadyLiked,
    likesCount: post.likes.length,
  });
}

module.exports = {
  createPostController,
  getFeedController,
  getSinglePostController,
  getUserPostsController,
  toggleLikeController,
};
