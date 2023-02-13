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
router.get(
  "/drivers/:id",
  jwtauth(["admin", "supervisor"]),
  async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return;

    const { password, ...data } = driver;
    res.send(data);
  }
);

//update specific trip
router.put(
  "/driver/:id/dailytrips/:tripId",
  jwtauth("supervisor"),
  async (req, res) => {
    try {
      const driver = await Driver.findById(req.params.id);
      const dailyTrips = driver.dailyTrips.find(
        (trip) => trip._id.toString() === req.params.tripId
      );
      dailyTrips.aprroved = true;
      const updatedDriver = await driver.save();
      res.json(updatedDriver);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
