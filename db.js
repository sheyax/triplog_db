const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected...."))
  .catch((err) => console.log(err));
