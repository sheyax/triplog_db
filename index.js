const express = require("express");
const bodyParser = require("body-parser");
require("./db");
const cors = require("cors");

var authentication = require("./controllers/authentication");
var datafeed = require("./controllers/datafeed");

const app = express();

app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json());

const port = 5000;

app.listen(port);

app.use("/auth", authentication);
app.use("/feed", datafeed);
