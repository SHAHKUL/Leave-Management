import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LeaveRequestForm from "./pages/LeaveRequestForm";
import ManagerDashboard from "./pages/ManagerDashboard";
import LeaveBalanceReport from "./pages/LeaveBalanceReport";
import UserProfile from "./pages/UserProfile";
import { useSelector } from "react-redux";
import LeaveType from "./pages/LeaveType";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="p-8 text-center text-red-600">
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="leave-request" element={<LeaveRequestForm />} />

          <Route path="profile/:id" element={<UserProfile />} />

          {/* Manager Routes */}
          <Route
            path="manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager/reports"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <LeaveBalanceReport />
              </ProtectedRoute>
            }
          />
            <Route
            path="manager/leave-type"
            element={
              <ProtectedRoute allowedRoles={["Manager"]}>
                <LeaveType />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
