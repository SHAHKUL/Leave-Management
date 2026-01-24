const LeaveBalance = require("../model/LeaveBalance");
const LeaveType = require("../model/LeaveType");

exports.getLeaveBalanceByEmployee = async (req, res, next) => {
  try {
    const { id: employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    const leaveTypes = await LeaveType.find();

    const balances = await LeaveBalance.find({
      employee: employeeId,
    }).populate("leaveType");
    const usedMap = {};

    balances.forEach((b) => {
      const leaveTypeId = b.leaveType._id.toString();

      if (!usedMap[leaveTypeId]) {
        usedMap[leaveTypeId] = 0;
      }

      usedMap[leaveTypeId] += b.usedDays || 0;
    });

    const leaveBalances = leaveTypes.map((type) => {
      const entitlement = type.defaultEntitlementDaysPerYear;
      const usedDays = usedMap[type._id.toString()] || 0;

      return {
        leaveType: type.name,
        usedDays,
        remainingDays: entitlement - usedDays,
        total: entitlement,
      };
    });

    res.status(200).json({
      leaveBalances,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllLeaveBalances = async (req, res, next) => {
  try {
    const balances = await LeaveBalance.find()
      .populate("employee", "name")
      .populate("leaveType", "name defaultEntitlementDaysPerYear");

    const result = balances.map((b) => {
      const entitlement =
        b.entitlementDays ?? b.leaveType.defaultEntitlementDaysPerYear;

      const used = b.usedDays || 0;

      return {
        employeeId: b.employee._id,
        employeeName: b.employee.name,
        leaveTypeId: b.leaveType._id,
        leaveType: b.leaveType.name,
        entitlementDays: entitlement,
        usedDays: used,
        remainingDays: entitlement - used,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
