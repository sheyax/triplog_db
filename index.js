const cors = require("cors");
const express = require("express");
// const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
require("./db");
require("dotenv").config();
global.__basedir = __dirname;

var corsOptions = {
  origin: [
    "https://o2j6sr-3000.preview.csb.app",
    "https://lqrx9m-3000.preview.csb.app",
    "https://b4tltc-3000.preview.csb.app",
  ],
  credentials: true,
};

var auth = require("./controllers/authentication");
var feed = require("./controllers/datafeed");

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

let port = 5000;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});

app.use("/auth", auth);
app.use("/feed", feed);
