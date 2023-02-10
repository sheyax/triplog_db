const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  roles: {
    type: String,
    default: "admin",
    enum: ["admin", "user", "supervisor"],
  },
});

module.exports = mongoose.model("admins", adminSchema);
