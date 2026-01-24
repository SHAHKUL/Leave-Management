// models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, required: true }, // Create, Update, Delete, Approve
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  performedOn: { type: Date, default: Date.now },
  details: { type: String },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
