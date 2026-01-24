const router = require("express").Router();
const controller = require("../controller/LeaveTypeController");

///manager route

router.post("/", controller.createLeaveType); // Create
router.get("/", controller.getLeaveTypes); // Read
router.put("/:id", controller.updateLeaveType); // Update
router.delete("/:id", controller.deleteLeaveType); // Delete

module.exports = router;
