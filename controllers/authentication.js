const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var ObjectId = require("mongoose").Types.ObjectId;

const Driver = require("../models/drivers");
const Admin = require("../models/admins");
const Engineer = require("../models/engineers");
const jwtauth = require("./authorization");

//driver register
router.post("/driver/register", async (req, res) => {
  //Generate hashpassword
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new Driver({
    username: req.body.username,
    driverId: req.body.driverId,
    password: hashPassword,
    assignedVehicle: req.body.vehicle,
    vehicleModel: req.body.vehicleModel,
  });

  //save user
  result = await user.save();
  const { password, ...data } = await result.toJSON();
  res.send(data);
});

// admin register
router.post("/admin/register", jwtauth("admin"), async (req, res) => {
  //Generate hashpassword
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create driver
  const newAdmin = new Admin({
    username: req.body.username,
    password: hashPassword,
  });

  //save Admin
  result = await newAdmin.save();
  const { password, ...data } = await result.toJSON();
  res.send(data);
});

// engineer register
router.post("/engineer/register", async (req, res) => {
  //Generate hashpassword
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create driver
  const newEngineer = new Engineer({
    driverId: req.body.driverId,
    engineerId: req.body.engineerId,
    password: hashPassword,
  });

  //save Admin
  result = await newEngineer.save();
  const { password, ...data } = await result.toJSON();
  res.send(data);
});

//login Route for driver
router.post("/driver/login", async (req, res) => {
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.json({
      status: "Failed",
      message: "empty credentials",
    });
  } else {
    //   check user exists
    Driver.find({ username })
      .then((data) => {
        if (data.length) {
          const hashPassword = data[0].password;
          bcrypt
            .compare(password, hashPassword)
            .then(async (result) => {
              if (result) {
                const token = await jwt.sign(
                  {
                    driverId: data[0].driverId,
                    username: data[0].username,
                    assignedVehicle: data[0].assignedVehicle,
                    roles: data[0].roles,
                  },
                  "jwtSecret"
                );

                res.cookie("jwt", token, {
                  httpOnly: true,
                  maxAge: 24 * 60 * 60 * 1000, //1 day
                });

                res.json({
                  status: "success",
                  message: "Login Successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "Failed",
                  message: "Error: invalid password",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "Failed",
                message: "An error occured checking password",
              });
            });
        } else {
          res.json({
            status: "Failed",
            message: "Invalid credentials",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "Failed",
          message: "An error occured checking user details",
        });
      });
  }
});

// login Admin
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (username == "" || password == "") {
    res.json({
      status: "Failed",
      message: "empty credentials",
    });
  } else {
    //   check user exists
    Admin.find({ username })
      .then((data) => {
        if (data.length) {
          const hashPassword = data[0].password;
          bcrypt
            .compare(password, hashPassword)
            .then(async (result) => {
              if (result) {
                const token = await jwt.sign(
                  {
                    username: data[0].username,

                    roles: data[0].roles,
                  },
                  "jwtSecret"
                );

                res.cookie("jwt", token, {
                  httpOnly: true,
                  maxAge: 24 * 60 * 60 * 1000, //1 day
                });

                res.json({
                  status: "success",
                  message: "Login Successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "Failed",
                  message: "Error: invalid password",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "Failed",
                message: "An error occured checking password",
              });
            });
        } else {
          res.json({
            status: "Failed",
            message: "Invalid credentials",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "Failed",
          message: "An error occured checking user details",
        });
      });
  }
});

// login Engineer
router.post("/engineer/login", async (req, res) => {
  const { engineerId, password } = req.body;

  if (engineerId == "" || password == "") {
    res.json({
      status: "Failed",
      message: "empty credentials",
    });
  } else {
    //   check user exists
    Engineer.find({ engineerId })
      .then((data) => {
        if (data.length) {
          const hashPassword = data[0].password;
          bcrypt
            .compare(password, hashPassword)
            .then(async (result) => {
              if (result) {
                const token = await jwt.sign(
                  {
                    engineerId: data[0].engineerId,

                    roles: data[0].roles,
                  },
                  "jwtSecret"
                );

                res.cookie("jwt", token, {
                  httpOnly: true,
                  maxAge: 24 * 60 * 60 * 1000, //1 day
                });

                res.json({
                  status: "success",
                  message: "Login Successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "Failed",
                  message: "Error: invalid password",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "Failed",
                message: "An error occured checking password",
              });
            });
        } else {
          res.json({
            status: "Failed",
            message: "Invalid credentials",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "Failed",
          message: "An error occured checking user details",
        });
      });
  }
});
//Logout

router.delete("/logout", (req, res) => {
  Driver.findOneAndUpdate({ username: req.body.username }, { token: "" }).then(
    () => {
      res.json({ msg: " successfully logged out" });
    }
  );
});

router.get("/driver/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "jwtSecret");

    if (!claims) {
      return res
        .sendStatus(401)
        .send({ message: "unauthenticated: no cookies" });
    }

    const driver = await Driver.findOne({
      driverId: claims.driverId,
      username: claims.username,
    });
    const { password, ...data } = await driver.toJSON();

    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: "unauthenticated user",
    });
  }
});

router.get("/admin/user", jwtauth("admin"), async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "jwtSecret");
    console.log(claims);

    if (!claims) {
      return res
        .sendStatus(401)
        .send({ message: "unauthenticated: no cookies" });
    }

    const admin = await Admin.findOne({
      roles: claims.roles,
      username: claims.username,
    });
    const { password, ...data } = await admin.toJSON();

    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: "unauthenticated user",
    });
  }
});

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

router.put("/driver/trip/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("no record with given id: " + req.params.id);
  }

  var newTrip = req.body;

  console.log(newTrip);

  try {
    let driver = await Driver.findById(req.params.id);
    driver.dailyTrips.push(newTrip);
    Driver.findByIdAndUpdate(
      req.params.id,
      { $set: driver },
      { new: true },
      (err, docs) => {
        if (!err) {
          res.send({
            status: "success",
            docs,
          });
        } else {
          console.log(
            "Error updating the record" + JSON.stringify(err, undefined, 2)
          );
        }
      }
    );
  } catch (err) {
    res.send({
      status: "Failed",
      message: "could not update trip",
    });
  }
});

//get specific trip

// router.get("/driver/:id/dailytrips/:tripId", async (req, res) => {
//   try {
//     const driver = await Driver.findById(req.params.id);
//     const dailyTrips = driver.dailyTrips.find(
//       (trip) => trip._id.toString() === req.params.tripId
//     );
//     res.json(dailyTrips);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//update specific trip
router.put("/driver/:id/dailytrips/:tripId", async (req, res) => {
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
});

module.exports = router;
