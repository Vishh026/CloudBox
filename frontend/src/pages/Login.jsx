import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axiosConfig from "../axiosConfig/axios";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (formData) => {
    setLoading(true);
    setServerError("");
    try {
      await axiosConfig.post(
        "/auth/login",
        {
          identifier: formData.identifier,
          password: formData.password,
        },
        { withCredentials: true }
      );
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error(error.response?.data || error);
      setServerError(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10 transition hover:shadow-2xl">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Sign in</h1>
          <p className="text-gray-500 text-sm mt-1">to continue to CloudBoxDrive</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <p className="text-center text-red-500 text-sm mb-3">{serverError}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Identifier */}
          <div>
            <label htmlFor="identifier" className="sr-only">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Email or Username"
              {...register("identifier", {
                required: "Email or Username is required",
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            {errors.identifier && (
              <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium transition active:scale-[.98] shadow-md ${
              loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
