import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { api } from "../utils/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [userDetails, setUserDetails] = useState(null); // <-- user info
  const [balances, setBalances] = useState([]); // leave balances
  const [isLoading, setIsLoading] = useState(true);

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Fetch user info and leave balances
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // 1️⃣ Fetch single user details
        const userData = await api.getUserById(token, id); // your backend should have /users/:id endpoint

        setUserDetails(userData);

        // 2️⃣ Fetch leave balances for this user
        const leaveData = await api.getOneBalances(token, id);

        setBalances(leaveData.leaveBalances);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, id]);

  if (isLoading)
    return <div className="p-8 text-center">Loading user profile...</div>;

  if (!userDetails)
    return <div className="p-8 text-center">User not found.</div>;

  const { name, email, role } = userDetails;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden shadow-lg bg-white/50 backdrop-blur-md">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white/50">
              {name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">{name}</h1>
              <p className="text-indigo-600 font-medium text-lg">{role}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoCard title="Email" value={email} />
            <InfoCard title="Role" value={role} />
          </div>

          {/* Leave Balances */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Leave Balances
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {balances.map((bal) => (
                <div
                  key={bal.leaveType}
                  className="p-4 rounded-xl bg-white/50 border border-white/60 shadow-sm text-center"
                >
                  <h3 className="text-sm font-bold text-slate-500">
                    {bal.leaveType}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Used: <span className="font-semibold">{bal.usedDays}</span>{" "}
                    / Total: <span className="font-semibold">{bal.total}</span>
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Remaining:{" "}
                    <span className="font-semibold">{bal.remainingDays}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl
               hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Back
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-red-100 text-red-600 font-bold rounded-xl
               hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Info card component
const InfoCard = ({ title, value }) => (
  <div className="group bg-white/50 p-6 rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-200">
    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
      {title}
    </h3>
    <p className="text-lg font-semibold text-slate-800">{value}</p>
  </div>
);

export default UserProfile;
