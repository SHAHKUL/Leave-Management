const express = require("express");
const router = express.Router();
const leaveController = require("../controller/LeaveRequestController");
const { authenticate, managerOnly } = require("../middleware/auth");

router.get("/get", authenticate, leaveController.getLeaveRequestsByEmployee);
router.get(
  "/all",
  authenticate,
  managerOnly,
  leaveController.getAllLeaveRequests,
);
router.post("/apply", leaveController.applyLeave);
router.post(
  "/approve/:leaveRequestId",
  authenticate,
  managerOnly,
  leaveController.approveLeaveStatus,
);
router.put("/update/:id", leaveController.updateUserLeaveStatus);

module.exports = router;
