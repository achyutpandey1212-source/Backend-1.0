const ImageKit = require("@imagekit/nodejs");
const postModel = require("../models/post.model");
const jwt = require("jsonwebtoken");

async function createPostController(req, res) {
  console.log(req.body, req.file);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorised user, access denied...",
    });
  }

  let decoded = null

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch(err){
    return res.status(401).json({
      message: "Unauthorised user, access denied..."
    })
  }

  console.log(decoded)

  const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  const baseString = req.file.buffer.toString("base64");

  const file = await client.files.upload({
    file: baseString,
    fileName: req.file.originalname || "test.jpg",
    folder: "/posts"
  });

  const newPost = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: decoded.id,
  });

  console.log(file);
  res.json(file);
}

module.exports = createPostController;
