const mongoose = require("mongoose");

var EngineerSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  engineerId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  roles: {
    type: String,
    default: "supervisor",
    enum: ["admin", "user", "supervisor"],
  },
});

module.exports = mongoose.model("Engineers", EngineerSchema);
