const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
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
      required: [true, "userid is required to create a post"],
    },
    userProfile: {
      ref: "userProfile",
      type: mongoose.Schema.Types.ObjectId,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

/* 
- Make "get all posts by user X" lightning fast
- getUsersPostsController uses: postModel.find({ user: userId })
- Without = scans every post in DB
- With = instant lookup
commenting to remember the concept of indexing
*/
postSchema.index({ user: 1 }); 


const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
