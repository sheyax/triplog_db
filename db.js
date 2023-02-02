const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://vratec:Saxydee23@cluster0.bkbpiod.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database Connected..."))
  .catch((err) => console.log(err));
