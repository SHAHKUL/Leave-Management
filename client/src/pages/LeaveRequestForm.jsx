import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../utils/api";

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const { userIde } = useSelector((state) => state.auth);

  // 🔹 Form state
  const [formData, setFormData] = useState({
    leaveType: "", // ✅ MUST be empty for placeholder
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [days, setDays] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const data = await api.getLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      console.error("Failed to load leave types", err);
    }
  };


  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);

      if (end < start) {
        setDays(0);
        setError("To Date cannot be before From Date");
        return;
      }

      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      setDays(diffDays);
      setError("");
    }
  }, [formData.fromDate, formData.toDate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leaveType) {
      setError("Please select a leave type");
      return;
    }

    if (days <= 0) {
      setError("Invalid date range");
      return;
    }

    if (formData.reason.length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createLeave({
        leaveType: formData.leaveType, // ✅ ID sent
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        days,
        employeeId: userIde,
        year: new Date().getFullYear(),
      });

      alert("Leave request submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl">
      <h3 className="text-2xl font-bold mb-6">New Leave Request</h3>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-bold mb-1">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="" disabled>
              Select Leave Type
            </option>

            {leaveTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="input-field w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
              min={new Date().toISOString().split("T")[0]} // ✅ today or future dates only
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="input-field w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
              min={formData.fromDate || new Date().toISOString().split("T")[0]}
              // ✅ To date cannot be earlier than From Date or today if From Date not selected
            />
          </div>
        </div>

        {/* Days */}
        <div className="bg-indigo-50 p-4 rounded font-semibold">
          Total Days: {days}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-bold mb-1">Reason</label>
          <textarea
            name="reason"
            rows="4"
            value={formData.reason}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter reason (min 10 characters)"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
