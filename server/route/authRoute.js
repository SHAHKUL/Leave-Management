const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authenticate } = require("../middleware/auth");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);
router.get("/users/:id", authController.getOneUser);
router.get("/all", authController.getAllUsers);
router.put("/user/:userId", authController.updateUserById);

module.exports = router;
