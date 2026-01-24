const LeaveType = require('../model/LeaveType');



exports.createLeaveType = async (req, res, next) => {
  try {
    const { name, defaultEntitlementDaysPerYear } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Leave type name is required' });
    }

    const exists = await LeaveType.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: 'Leave type already exists' });
    }

    const leaveType = await LeaveType.create({
      name,
      defaultEntitlementDaysPerYear
    });

    res.status(201).json({
      message: 'Leave type created successfully',
      data: leaveType
    });
  } catch (err) {
    next(err);
  }
};


exports.getLeaveTypes = async (req, res, next) => {
  try {
    const leaveTypes = await LeaveType.find().sort({ createdAt: -1 });
    res.json(leaveTypes);
  } catch (err) {
    next(err);
  }
};


exports.updateLeaveType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, defaultEntitlementDaysPerYear } = req.body;

    const leaveType = await LeaveType.findById(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }

    if (name && name !== leaveType.name) {
      const exists = await LeaveType.findOne({ name });
      if (exists) {
        return res.status(409).json({ message: 'Leave type name already exists' });
      }
    }

    leaveType.name = name ?? leaveType.name;
    leaveType.defaultEntitlementDaysPerYear =
      defaultEntitlementDaysPerYear ?? leaveType.defaultEntitlementDaysPerYear;

    await leaveType.save();

    res.json({
      message: 'Leave type updated successfully',
      data: leaveType
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteLeaveType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leaveType = await LeaveType.findByIdAndDelete(id);
    if (!leaveType) {
      return res.status(404).json({ message: 'Leave type not found' });
    }
    res.json({ message: 'Leave type deleted successfully' });
  } catch (err) {
    next(err);
  }
};
