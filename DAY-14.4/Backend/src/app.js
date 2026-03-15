require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userProfileRouter = require("./routes/userProfile.routes");
const followRouter = require("./routes/follow.routes");
const likeRouter = require("./routes/like.routes")
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();

app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:5174"]
}))
app.use(express.json());
app.use(cookieParser());


// @routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/userprofile", userProfileRouter);
app.use("/api", followRouter);
app.use("/api", likeRouter)

module.exports = app;
