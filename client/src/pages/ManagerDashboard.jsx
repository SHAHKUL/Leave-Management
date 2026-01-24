import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { api } from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // 'Approve' or 'Decline'
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { userIde, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLeaves(token);

      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setComment("");
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (selectedRequest) {
      try {
        await api.updateLeaveStatus(
          selectedRequest._id,
          actionType === "Approve" ? "Approved" : "Declined",
          userIde,
          comment,
          token,
        );
        setIsModalOpen(false);
        fetchRequests(); // Refresh
      } catch (e) {
        console.error(e);
        alert("Failed to update status");
      }
    }
  };

  const pendingRequests = requests;

  const handleRowClick = (employeeId) => {
    navigate(`/profile/${employeeId}`);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">Loading requests...</div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Manager Dashboard</h1>

      {/* Pending Approvals */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-medium text-slate-900">
            Pending Approvals
          </h3>
        </div>
        <ul className="space-y-3">
          {pendingRequests.map((request) => (
            <li
              key={request._id}
              className="bg-white rounded-xl border border-slate-200
                 p-6 shadow-sm hover:shadow-md
                 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-6">
                {/* LEFT CONTENT */}
                <div className="flex-1 min-w-0">
                  {/* Employee Name */}
                  <p
                    onClick={() => handleRowClick(request.employee._id)}
                    className="text-xl font-semibold text-indigo-700
                       cursor-pointer hover:underline"
                  >
                    {request.employee.name}
                  </p>

                  {/* Leave Info */}
                  <p className="text-sm text-slate-700 mt-1">
                    Requested{" "}
                    <span className="font-semibold text-slate-900">
                      {request.days} days
                    </span>{" "}
                    ({new Date(request.fromDate).toLocaleDateString()} –{" "}
                    {new Date(request.toDate).toLocaleDateString()})
                  </p>

                  {/* Reason */}
                  <p className="text-sm text-slate-500 italic mt-2 max-w-2xl">
                    “{request.reason}”
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                      {request.leaveType.name}
                    </span>
                    <span>•</span>
                    <span>
                      Submitted{" "}
                      {new Date(request.submittedOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(request, "Approve")}
                    className="px-5 py-2 text-sm font-semibold rounded-lg
                       text-white bg-emerald-600 hover:bg-emerald-700
                       shadow-sm transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(request, "Decline")}
                    className="px-5 py-2 text-sm font-semibold rounded-lg
                       text-white bg-rose-600 hover:bg-rose-700
                       shadow-sm transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </li>
          ))}

          {pendingRequests.length === 0 && (
            <li
              className="bg-white rounded-xl border border-slate-200
                   p-10 text-center text-slate-500 text-sm"
            >
              No pending approvals.
            </li>
          )}
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${actionType} Request for ${selectedRequest?.employee.name}`}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to {actionType.toLowerCase()} this request?
          </p>
          <div className="mt-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Manager Comment {actionType === "Decline" && "(Required)"}
            </label>
            <div className="mt-1">
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-slate-300 rounded-md"
                placeholder={
                  actionType === "Approve"
                    ? "Optional comment..."
                    : "Reason for declining..."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
              actionType === "Decline"
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            }`}
            onClick={confirmAction}
            disabled={actionType === "Decline" && !comment}
          >
            Confirm {actionType}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;
