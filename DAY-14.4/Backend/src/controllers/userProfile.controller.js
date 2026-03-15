const { default: mongoose } = require("mongoose");
const userProfileModel = require("../models/userProfile.model");
const ImageKit = require("@imagekit/nodejs");

async function userProfileController(req, res) {
  console.log(req.body, req.file);

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

  const userProfile = await userProfileModel.create({
    user: req.user.id,
    profileImg: file.url,
    bio: req.body.bio,
    isPrivate: req.body.isPrivate,
  });

  return res.status(201).json({
    message: "user details saved successfully...",
    userProfile,
  });
}

module.exports = userProfileController;
