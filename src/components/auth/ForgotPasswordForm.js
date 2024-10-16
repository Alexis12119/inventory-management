import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from './supabaseClient';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "https://inventory-management-rust-mu.vercel.app/reset-password",
    });
    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox!");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      {message && <p className="text-center text-green-500">{message}</p>}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Send Reset Email
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

export default ForgotPasswordForm;
