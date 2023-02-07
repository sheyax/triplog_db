const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Driver = require("../models/drivers");
const Admin = require("../models/admins");
const jwtauth = require("./authorization");

//driver register
router.post("/register", async (req, res) => {
  //Generate hashpassword
  const salt = await bcrypt.genSalt(10);
  //const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new Driver({
    username: req.body.username,
    driverId: req.body.driverId,
    password: req.body.password,
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

//login Route for driver
router.post("/driver/login", async (res, req) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check uif driver exists
  Driver.findOne({ username }).then((driver) => {
    if (!driver) return res.status(400).json({ msg: "Driver does not exist" });

    // Validate password
    bcrypt.compare(password, driver.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign(
        {
          driver: {
            driverid: driver._id,
            username: driver.username,
            assignedVehicle: driver.assignedVehicle,
            roles: driver.roles,
          },
        },
        "jwtSecret"
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //1 day
      });
    });
  });
});

// login Admin
router.post("/admin/login", async (res, req) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check if Admin exists
  Admin.findOne({ username }).then((admin) => {
    if (!admin) return res.status(400).json({ msg: "admin does not exist" });

    // Validate password
    bcrypt.compare(password, admin.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign(
        {
          admin: {
            adminid: admin._id,
            username: admin.username,
            roles: admin.roles,
          },
        },
        "jwtSecret"
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //1 day
      });
    });
  });
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

    const claims = jwt.verify(cookie, process.env.SECRET_JWT_KEY);

    if (!claims) {
      return res.sendStatus(401).send({ message: "unauthenticated" });
    }

    const driver = await Driver.findOne({
      driverId: claims.driverId,
      username: claims.username,
    });
    const { password, ...data } = await driver.toJSON();

    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
});
module.exports = router;
