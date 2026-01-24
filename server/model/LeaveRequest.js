// models/LeaveRequest.js
const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeaveType",
    required: true,
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true, minlength: 10 },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Declined", "Withdrawn"],
    default: "Pending",
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  managerComment: { type: String },
  submittedOn: { type: Date, default: Date.now },
  lastModifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
