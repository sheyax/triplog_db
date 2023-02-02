const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
    required: true,
  },
  assignedVehicle: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  dailyTrips: {
    type: [
      {
        date: { type: Date },
        startTime: { type: String },
        endTime: { type: String },
        startLocation: { type: String },
        endLocation: { type: String },
        startOdometer: { type: String },
        endOdometer: { type: String },
        aprroved: { type: Boolean, default: false },
      },
    ],
    required: true,
  },
  roles: {
    type: String,
    default: "user",
    enum: ["admin", "user", "supervisor"],
  },
});

module.exports = mongoose.model("driversLog", DriverSchema);
