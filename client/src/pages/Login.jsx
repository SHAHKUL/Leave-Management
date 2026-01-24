import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await api.login(email, password);

      dispatch(login(user));

      if (user.role === "Manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
       <div className="auth-layout">
      {/* HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">

        <h2 className="mt-4 text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Welcome Back
        </h2>
        <p className="mt-2 text-lg text-indigo-100 font-medium opacity-90">
          Sign in to your account
        </p>
      </div>

      {/* CARD */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="auth-card-container relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-20 blur-xl"></div>

          {/* FORM */}
          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Ex. alice@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  New here?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-base font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPMENT ADMIN INFO */}
 
        <div className="mt-6 text-center text-sm text-grey-200">
          <p className="font-bold tex-4xl">Admin Login (Development Only)</p>
          <p>
            Email: <span className=" font-bold">john@gmail.com</span>
          </p>
          <p>
            Password: <span className="font-bold">123</span>
          </p>
        </div>
    
    </div>

    
  );
};

export default Login;
