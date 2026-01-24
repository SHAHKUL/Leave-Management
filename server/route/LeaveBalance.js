const express = require("express");
const router = express.Router();

const leaveBalanceController = require("../controller/LeaveBalanceController");
const { authenticate, managerOnly } = require("../middleware/auth");

router.get(
  "/my/:id",
  authenticate,
  leaveBalanceController.getLeaveBalanceByEmployee,
);

router.get(
  "/",
  authenticate,
  managerOnly,
  leaveBalanceController.getAllLeaveBalances,
);

module.exports = router;
