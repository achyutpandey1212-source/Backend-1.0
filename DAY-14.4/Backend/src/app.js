require("dotenv").config();
const express = require("express");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userProfileRouter = require("./routes/userProfile.routes");
const followRouter = require("./routes/follow.routes");
const likeRouter = require("./routes/like.routes")
const commentRouter = require("./routes/comment.routes");
const bookmarkRouter = require("./routes/bookmark.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const path = require("path")

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
    credentials: true,
    origin: allowedOrigins
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")))

// @routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/userprofile", userProfileRouter);
app.use("/api", followRouter);
app.use("/api", likeRouter)
app.use("/api/posts", commentRouter);
app.use("/api/bookmarks", bookmarkRouter);

// @wild-card middleware
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
