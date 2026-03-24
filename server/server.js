require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./route/authRoute");
const leaveRequestRoute = require("./route/LeaveRoute");
const leaveTypeRoutes = require("./route/LeaveTypeRoute");
const leaveBalanceRoutes = require("./route/LeaveBalance");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB

mongoose
  .connect(process.env.URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server connected on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leave-request", leaveRequestRoute);
app.use("/api/leave-types", leaveTypeRoutes);
app.use("/api/leave-balance", leaveBalanceRoutes);

// Error handler

app.get('/',(req,res)=>{
  res.status(500).json({message:"server running successfully"})
})
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});
