require("dotenv").config()
const express = require("express");
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

module.exports = app;
