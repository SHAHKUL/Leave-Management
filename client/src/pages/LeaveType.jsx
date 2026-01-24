import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../utils/api";

const LeaveType = () => {
  const { token } = useSelector((state) => state.auth);

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */
  const fetchLeaveTypes = async () => {
    const data = await api.getLeaveTypes(token);
    setLeaveTypes(data);
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        defaultEntitlementDaysPerYear: Number(days),
      };

      if (editingId) {
        await api.updateLeaveType(token, editingId, payload);
      } else {
        await api.createLeaveType(token, payload);
      }

      setName("");
      setDays("");
      setEditingId(null);
      fetchLeaveTypes();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (type) => {
    setEditingId(type._id);
    setName(type.name);
    setDays(type.defaultEntitlementDaysPerYear);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this leave type?")) return;
    await api.deleteLeaveType(token, id);
    fetchLeaveTypes();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Leave Types</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Leave Type Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded-lg px-4 py-2 w-1/2"
        />
        <input
          type="number"
          placeholder="Default Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          required
          className="border rounded-lg px-4 py-2 w-1/4"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 text-left text-sm">
            <th className="p-3">Leave Type</th>
            <th className="p-3">Default Days</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((type) => (
            <tr
              key={type._id}
              className="border-b hover:bg-slate-50 transition"
            >
              <td className="p-3 font-medium">{type.name}</td>
              <td className="p-3">{type.defaultEntitlementDaysPerYear}</td>
              <td className="p-3 text-right space-x-2">
                <button
                  onClick={() => handleEdit(type)}
                  className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(type._id)}
                  className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {leaveTypes.length === 0 && (
            <tr>
              <td colSpan="3" className="p-6 text-center text-slate-500">
                No leave types found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveType;
