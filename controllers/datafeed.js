const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Driver = require("../models/drivers");
const Admin = require("../models/admins");

const jwtauth = require("./authorization");

//get all drivers

router.get("/drivers", async (req, res) => {
  Driver.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("Error retrieving data" + JSON.stringify(err, undefined, 2));
    }
  });
});

//get driver by id
router.get("/drivers/:id", jwtauth("admin"), async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return;

  const { password, ...data } = driver;
  res.send(data);
});

module.exports = router;
