const express = require("express");
const bodyParser = require("body-parser");
require("./db");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "https://o2j6sr-3000.preview.csb.app",
};

app.use(
  cors({
    origin: "https://o2j6sr-3000.preview.csb.app",
  })
);
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json());

var authentication = require("./controllers/authentication");
var datafeed = require("./controllers/datafeed");

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

const port = 5000;

app.listen(port);

app.use("/auth", authentication);
app.use("/feed", datafeed);
