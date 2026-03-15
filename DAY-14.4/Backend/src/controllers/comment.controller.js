const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

function buildCommentTree(comments) {
  const map = new Map();
  const roots = [];

  comments.forEach((comment) => {
    const item = comment.toObject();
    item.replies = [];
    map.set(String(comment._id), item);
  });

  comments.forEach((comment) => {
    const item = map.get(String(comment._id));
    if (comment.parent) {
      const parent = map.get(String(comment.parent));
      if (parent) {
        parent.replies.push(item);
      } else {
        roots.push(item);
      }
    } else {
      roots.push(item);
    }
  });

  return roots;
}

async function createCommentController(req, res) {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = await commentModel.create({
    post: postId,
    user: req.user.id,
    content: content.trim(),
  });

  await postModel.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });

  const populated = await commentModel
    .findById(comment._id)
    .populate({ path: "user", select: "username" });

  return res.status(201).json({
    message: "Comment added",
    comment: populated,
  });
}

async function replyToCommentController(req, res) {
  const { postId, parentId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Reply content is required" });
  }

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const parent = await commentModel.findById(parentId);
  if (!parent) {
    return res.status(404).json({ message: "Parent comment not found" });
  }

  if (String(parent.post) !== String(postId)) {
    return res.status(400).json({ message: "Invalid parent comment" });
  }

  const reply = await commentModel.create({
    post: postId,
    user: req.user.id,
    parent: parentId,
    content: content.trim(),
  });

  await postModel.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });

  const populated = await commentModel
    .findById(reply._id)
    .populate({ path: "user", select: "username" });

  return res.status(201).json({
    message: "Reply added",
    comment: populated,
  });
}

async function getCommentsForPostController(req, res) {
  const { postId } = req.params;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comments = await commentModel
    .find({ post: postId })
    .sort({ createdAt: 1 })
    .populate({ path: "user", select: "username" });

  const tree = buildCommentTree(comments);

  return res.status(200).json({
    message: "Comments fetched",
    comments: tree,
  });
}

async function deleteCommentController(req, res) {
  const { commentId } = req.params;
  const currentUserId = req.user.id;

  const comment = await commentModel.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const isCommentOwner = String(comment.user) === String(currentUserId);

  if (!isCommentOwner) {
    return res.status(403).json({ message: "Not allowed to delete comment" });
  }

  const repliesCount = await commentModel.countDocuments({ parent: commentId });
  await commentModel.deleteMany({ parent: commentId });
  await commentModel.deleteOne({ _id: commentId });

  const totalDeleted = 1 + repliesCount;
  await postModel.updateOne(
    { _id: comment.post },
    { $inc: { commentCount: -totalDeleted } },
  );

  return res.status(200).json({
    message: "Comment deleted",
    deletedCount: totalDeleted,
  });
}

module.exports = {
  createCommentController,
  replyToCommentController,
  getCommentsForPostController,
  deleteCommentController,
};
