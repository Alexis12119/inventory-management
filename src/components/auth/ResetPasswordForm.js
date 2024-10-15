import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const type = query.get('type');

    // Check if the token is present and type is "recovery"
    if (!token || type !== 'recovery') {
      alert('Invalid or expired token.');
      navigate('/');
    }
  }, [location, navigate]);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Use the reset token to update the user's password
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      alert("Password reset successful. You can now log in.");
      navigate('/'); // Redirect to login page
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Password reset successfully!</div>}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <button
        onClick={handleResetPassword}
        className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Set New Password
      </button>
    </div>
  );
};

export default ResetPassword;
