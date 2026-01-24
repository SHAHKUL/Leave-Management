const LeaveRequest = require("../model/LeaveRequest");
const LeaveBalance = require("../model/LeaveBalance");
const Notification = require("../model/Notification");
const AuditLog = require("../model/AuditLog");
const LeaveType = require("../model/LeaveType");

exports.getLeaveRequestsByEmployee = async (req, res, next) => {
  try {
    const { id: employeeId } = req.user;

    if (!employeeId) {
      return res.status(400).json({
        message: "employeeId is required",
      });
    }

    const leaveRequests = await LeaveRequest.find({
      employee: employeeId,
    }).populate("leaveType", "name defaultEntitlementDaysPerYear");

    res.json(leaveRequests);
  } catch (err) {
    next(err);
  }
};

exports.getAllLeaveRequests = async (req, res, next) => {
  try {
    const leaveRequests = await LeaveRequest.find({ status: "Pending" })
      .populate("leaveType")
      .populate("employee")
      .populate("manager");

    res.json(leaveRequests);
  } catch (err) {
    next(err);
  }
};

exports.applyLeave = async (req, res, next) => {
  try {
    const {
      employeeId,
      leaveType: leaveTypeId,
      fromDate,
      toDate,
      days,
      reason,
      year,
    } = req.body;

    // 1. Check leave balance
    let balance = await LeaveBalance.findOne({
      employee: employeeId,
      leaveType: leaveTypeId,
      year,
    });

    if (!balance) {
      const leaveType = await LeaveType.findById(leaveTypeId);

      if (!leaveType) {
        return res.status(400).json({ message: "Invalid leave type" });
      }

      balance = await LeaveBalance.create({
        employee: employeeId,
        leaveType: leaveTypeId,
        year,
        entitlementDays: leaveType.defaultEntitlementDaysPerYear,
        usedDays: 0,
      });
    }

    if (balance.entitlementDays - balance.usedDays < days) {
      return res.status(400).json({ message: "Insufficient leave balance" });
    }

    const leaveRequest = await LeaveRequest.create({
      employee: employeeId,
      leaveType: leaveTypeId,
      fromDate,
      toDate,
      days,
      reason,
    });

    await Notification.create({
      user: employeeId,
      message: "New leave request pending approval",
    });

    res.status(201).json({ message: "Leave applied successfully" });
  } catch (err) {
    next(err);
  }
};

exports.approveLeaveStatus = async (req, res, next) => {
  try {
    const { leaveRequestId } = req.params;
    const { status, managerId, managerComment } = req.body;

    const leave = await LeaveRequest.findById(leaveRequestId);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status;
    leave.manager = managerId;
    leave.managerComment = managerComment;
    leave.lastModifiedOn = new Date();
    await leave.save();

    if (status === "Approved") {
      const val = await LeaveBalance.findOneAndUpdate(
        {
          employee: leave.employee,
          leaveType: leave.leaveType,
        },
        {
          usedDays: leave.days,
        },
        { new: true },
      );
    }

    await AuditLog.create({
      entity: "LeaveRequest",
      entityId: leave._id,
      action: status.toUpperCase(),
      performedBy: managerId,
      details: `Leave ${status} by manager ${managerId}`,
    });

    await Notification.create({
      user: leave.employee,
      message: `Your leave request has been ${status}`,
    });

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLeave = await LeaveRequest.findByIdAndUpdate(id, { status });

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      leave: updatedLeave,
    });
  } catch (err) {
    next(err);
  }
};
