const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ post: 1, parent: 1, createdAt: 1 });
commentSchema.index({ parent: 1, createdAt: 1 });
commentSchema.index({ user: 1, createdAt: -1 });

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
