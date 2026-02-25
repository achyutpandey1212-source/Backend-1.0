const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unqiue: [true, "username not available"],
    required: true,
  },
  email: {
    type: String,
    unique: [true, "user already exists"],
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
      "https://ik.imagekit.io/1gileoynr/default-profile-picture-avatar-user-icon-vector-46389216.avif?updatedAt=1771771461998",
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
