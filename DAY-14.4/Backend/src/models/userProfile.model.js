const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    profileImg: {
      type: String,
      default:
        "https://ik.imagekit.io/1gileoynr/default-profile-picture-avatar-user-icon-vector-46389216.avif?updatedAt=1771771461998",
    },
    bio: {
      type: String,
      default: "",
    },
    followerCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const userProfileModel = mongoose.model("userProfile", userProfileSchema);

module.exports = userProfileModel;
