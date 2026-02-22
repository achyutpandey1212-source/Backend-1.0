const app = require("./src/app");
const connectDb = require("./src/config/database");
require("dotenv").config()

connectDb();

app.listen(3000, () => {
  console.log("server is running on port 3000...");
});
