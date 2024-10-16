import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = searchParams.get("token");
  console.log(accessToken);
  useEffect(() => {
    if (accessToken) {
      supabase.auth.setSession({
        accessToken,
        accessToken,
      });
    } else {
      setMessage("Missing access token");
    }
  }, [location]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const userSession = await supabase.auth.getSession();
    console.log("userSession 1:", userSession);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage("Error resetting password: " + error.message);
    } else {
      setMessage("Password has been reset. You can now log in.");
      navigate("/");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Reset Password</h2>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <div
          className="absolute right-3 top-3 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiFillEyeInvisible size={24} />
          ) : (
            <AiFillEye size={24} />
          )}
        </div>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <div
          className="absolute right-3 top-3 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiFillEyeInvisible size={24} />
          ) : (
            <AiFillEye size={24} />
          )}
        </div>
      </div>
      {message && <p className="text-center text-red-500">{message}</p>}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Reset Password
      </button>
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 hover:underline w-full"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ResetPasswordForm;
