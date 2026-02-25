const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: String,
  imgUrl: {
    type: String,
    required: true,
  },
  user: {
    ref: "user",
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user id is required for creating a post"],
  },
});

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
