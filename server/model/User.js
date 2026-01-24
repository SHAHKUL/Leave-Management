const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["Employee", "Manager"], default: "Employee" },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
