const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(
      "mongodb+srv://achyut:zKpbLDzVyD4e72Fm@cluster0.hqevgck.mongodb.net/DAY-6",
    )
    .then(() => {
      console.log("Db connected successfully...");
    });
}

module.exports = connectToDb;
