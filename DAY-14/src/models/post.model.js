const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      required: true,
    },
    user: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "userID is required for creating a post"],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
