const express = require("express");
const bodyParser = require("body-parser");
require("./db");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "https://o2j6sr-3000.preview.csb.app/",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json());

var authentication = require("./controllers/authentication");
var datafeed = require("./controllers/datafeed");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use("/auth", authentication);
app.use("/feed", datafeed);
const port = 5000;

app.listen(port);
