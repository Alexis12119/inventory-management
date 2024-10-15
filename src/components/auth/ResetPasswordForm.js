import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [tokenVerified, setTokenVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to extract token from query params
  const extractTokenFromQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('token'); // Get 'token' from query string
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = extractTokenFromQuery();
      console.log(token);

      if (token) {
        const { error } = await supabase.auth.verifyOtp({
          type: 'recovery', // Type must be 'recovery' for password reset
          token,
        });

        if (error) {
          alert("Invalid or expired token.");
        } else {
          setTokenVerified(true); // Token verified successfully
        }
      } else {
        alert("No token found in the URL.");
      }

      setLoading(false); // Finish loading regardless
    };

    verifyToken();
  }, [location]);

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert("Password reset successful. Please log in.");
      navigate('/'); // Redirect to login page
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!tokenVerified) return <div>Invalid or expired token.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <button
        onClick={handleResetPassword}
        className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPasswordForm;
