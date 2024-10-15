import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://inventory-management-rust-mu.vercel.app/reset-password',
    });
    if (error) alert(error.message);
    else alert("Password reset email sent. Please check your inbox.");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Forgot Your Password?</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <button
        onClick={handleForgotPassword}
        className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Reset Password
      </button>
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:underline w-full"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
