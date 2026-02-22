const mongoose = require("mongoose");

function connectDb() {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("DB connected successfully...");
  });
}

module.exports = connectDb;