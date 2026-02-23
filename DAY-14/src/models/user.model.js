const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username already exists"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "email already exists"],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/1gileoynr/default-profile-picture-avatar-user-icon-vector-46389216.avif",
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
