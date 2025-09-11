import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../Routes/Auth";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await loginUser(formData);
      console.log("Login Success:", response.data);
      navigate("/"); // redirect to dashboard
    } catch (error) {
      console.error(error.response?.data || error);
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Sign in</h1>
          <p className="text-gray-500 text-sm">to continue to CloudBox</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email or Username */}
          <div>
            <input
              type="text"
              placeholder="Email or Username"
              {...register("identifier", {
                required: "Email or Username is required",
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            {errors.identifier && (
              <p className="text-red-500 text-xs mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition active:scale-[.98] shadow-md
              ${
                loading
                  ? "bg-gray-400 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
