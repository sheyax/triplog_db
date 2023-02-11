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

// // update driver trips
// router.put("/driver/:id", async (req, res) => {
//   if (!ObjectId.isValid(req.params.id)) {
//     return res.status(400).send("no record with given id: " + req.params.id);
//   }

//   var dataUpdate = {
//     dailyTrips: req.body.dailyTrips,
//   };

//   console.log(dataUpdate);

//   Driver.findByIdAndUpdate(
//     req.params.id,
//     { $set: dataUpdate },
//     { $new: true },
//     (err, docs) => {
//       if (!err) {
//         res.send(docs);
//       } else {
//         console.log(
//           "Error updating the record" + JSON.stringify(err, undefined, 2)
//         );
//       }
//     }
//   );
// });

module.exports = router;
