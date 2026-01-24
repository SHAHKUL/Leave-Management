import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useSelector((state) => state.auth);

  const fetchLeavesRequest = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLeaveRequest(token);
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavesRequest();
  }, []);

  const filteredLeaves =
    filterStatus === "All"
      ? leaves
      : leaves.filter((l) => l.status === filterStatus);

  const handleWithdraw = async (id) => {
    if (window.confirm("Are you sure you want to withdraw this request?")) {
      try {
        await api.updateUserLeaveStatus(id, "Withdrawn");
        fetchLeavesRequest();
      } catch (e) {
        console.error(e);
        alert("Failed to withdraw");
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">
            My Dashboard
          </h1>
          <p className="mt-2 text-slate-800 font-medium">
            Manage and track your leave requests
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/leave-request"
            className="btn-primary shadow-xl"
            style={{ width: "auto", display: "inline-flex" }}
          >
            + New Request
          </Link>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-gray-200/30">
          <div className="flex space-x-2 bg-white/40 p-1 rounded-lg">
            {["All", "Pending", "Approved", "Declined"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  filterStatus === status
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="text-sm font-medium text-gray-600 bg-white/40 px-3 py-1 rounded-full">
            Total: {filteredLeaves.length}
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead>
              <tr className="bg-indigo-50/50">
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider rounded-l-lg"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Days
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Submitted
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider rounded-r-lg"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/30 bg-transparent">
              {filteredLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="hover:bg-white/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                    {leave.leaveType.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span>
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        to {new Date(leave.toDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    {leave.days}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : leave.status === "Declined"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(leave.submittedOn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {leave.status === "Pending" && (
                      <button
                        onClick={() => handleWithdraw(leave._id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                      >
                        Withdraw
                      </button>
                    )}
                    {leave.status !== "Pending" && (
                      <span className="text-gray-400 text-xs italic">
                        Closed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 bg-white/20 rounded-lg"
                  >
                    <p className="text-lg">No leave requests found.</p>
                    <p className="text-sm">
                      Create a new request to get started.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
