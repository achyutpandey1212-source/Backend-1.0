const likeModel = require("../models/like.model");
const postModel = require("../models/post.model");

// like post controller
async function likePostController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
      });
    }

    const isLiked = await likeModel.findOne({ user: userId, post: postId });

    if (isLiked) {
      return res.status(409).json({
        message: "post already liked...",
      });
    } else {
      await likeModel.create({ user: userId, post: postId });
      await postModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { likeCount: 1 } },
      );

      const updatedPost = await postModel.findOne({ _id: postId });
      return res.status(201).json({
        message: "post liked",
        likeCount: updatedPost.likeCount,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      error: err.message,
    });
  }
}

// unlike post controller
async function unlikePostController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const isLiked = await likeModel.findOne({ user: userId, post: postId });

    if (!isLiked) {
      return res.status(409).json({
        message: "Post not liked",
      });
    } else {
      await likeModel.deleteOne({ user: userId, post: postId });
      await postModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { likeCount: -1 } },
      );

      const updatedPost = await postModel.findById(postId);

      return res.status(200).json({
        message: "unliked post...",
        likeCount: updatedPost.likeCount,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = { likePostController, unlikePostController };
