const bookmarkModel = require("../models/bookmark.model");
const postModel = require("../models/post.model");

async function addBookmarkController(req, res) {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const existing = await bookmarkModel.findOne({ user: userId, post: postId });
  if (existing) {
    return res.status(409).json({ message: "Post already bookmarked" });
  }

  const bookmark = await bookmarkModel.create({ user: userId, post: postId });

  return res.status(201).json({
    message: "Post bookmarked",
    bookmarkId: bookmark._id,
  });
}

async function removeBookmarkController(req, res) {
  const { postId } = req.params;
  const userId = req.user.id;

  const bookmark = await bookmarkModel.findOne({
    user: userId,
    post: postId,
  });

  if (!bookmark) {
    return res.status(404).json({ message: "Bookmark not found" });
  }

  await bookmarkModel.deleteOne({ _id: bookmark._id });

  return res.status(200).json({ message: "Bookmark removed" });
}

async function getMyBookmarksController(req, res) {
  const userId = req.user.id;

  const bookmarks = await bookmarkModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "post",
      populate: [
        { path: "user", select: "username" },
        { path: "userProfile", select: "profileImg" },
      ],
    });

  const posts = bookmarks
    .map((bookmark) => bookmark.post)
    .filter(Boolean);

  return res.status(200).json({
    message: "Bookmarks fetched",
    posts,
  });
}

module.exports = {
  addBookmarkController,
  removeBookmarkController,
  getMyBookmarksController,
};
