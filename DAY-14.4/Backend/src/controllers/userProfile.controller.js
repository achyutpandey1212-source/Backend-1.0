const { default: mongoose } = require("mongoose");
const userProfileModel = require("../models/userProfile.model");
const ImageKit = require("@imagekit/nodejs");

async function userProfileController(req, res) {
  console.log(req.body, req.file);

  let uploadedUrl;
  if (req.file) {
    const client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });

    const base64string = req.file.buffer.toString("base64");

    const file = await client.files.upload({
      file: base64string,
      fileName: req.file.originalname,
      folder: "insta-profile-pics",
    });

    uploadedUrl = file.url;
  }

  const userProfile = await userProfileModel.create({
    user: req.user.id,
    ...(uploadedUrl ? { profileImg: uploadedUrl } : {}),
    bio: req.body.bio,
    isPrivate: req.body.isPrivate,
  });

  return res.status(201).json({
    message: "user details saved successfully...",
    userProfile,
  });
}

async function getUserProfileController(req, res) {
  const userId = req.params.userId;

  const userProfile = await userProfileModel.findOne({ user: userId }).populate('user', 'username');

  if (!userProfile) {
    return res.status(404).json({
      message: "User profile not found",
    });
  }

  return res.status(200).json({
    message: "User profile fetched",
    userProfile,
  });
}

module.exports = { userProfileController, getUserProfileController };
