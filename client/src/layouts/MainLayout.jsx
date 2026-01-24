import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, userIde, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };


  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <nav className="glass-panel sticky top-4 mx-4 mt-4 rounded-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-800 bg-clip-text text-transparent">
                  LeaveManager
                </span>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors duration-200 ${
                    isActive("/")
                      ? "border-indigo-700 text-indigo-900"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  My Dashboard
                </Link>

                {role === "Manager" && (
                  <>
                    <Link
                      to="/manager/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors duration-200 ${
                        isActive("/manager/dashboard")
                          ? "border-indigo-700 text-indigo-900"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                      }`}
                    >
                      Approvals
                    </Link>
                    <Link
                      to="/manager/reports"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors duration-200 ${
                        isActive("/manager/reports")
                          ? "border-indigo-700 text-indigo-900"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                      }`}
                    >
                      Reports
                    </Link>
                     <Link
                      to="manager/leave-type"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors duration-200 ${
                        isActive("manager/leave-type")
                          ? "border-indigo-700 text-indigo-900"
                          : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                      }`}
                    >
                      Leave Type
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-4">
                <Link to={`/profile/${userIde}`} className="group">
                  <span
                    className="text-sm font-bold text-slate-700 bg-white/60 px-3 py-1 rounded-full border border-white/40 shadow-sm 
                   group-hover:bg-white/80 transition-all duration-200 cursor-pointer"
                  >
                    {name}{" "}
                    <span className="text-xs text-slate-500">({role})</span>
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg hover:from-slate-800 hover:to-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
