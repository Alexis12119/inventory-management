import React, { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthForm = ({
  isSignUp,
  isForgotPassword,
  setIsForgotPassword,
  setIsSignUp,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Signup successful. Please check your email.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else navigate("/inventory");
    }
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert(error.message);
    else alert("Password reset email sent. Please check your inbox.");
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      {!isForgotPassword && (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
      )}
      {isForgotPassword ? (
        <>
          <button
            onClick={handleForgotPassword}
            className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Reset Password
          </button>
          <button
            onClick={() => setIsForgotPassword(false)}
            className="text-blue-600 hover:underline w-full"
          >
            Back to Login
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleAuth}
            className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
          {!isSignUp && (
            <>
              <button
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-600 hover:underline w-full"
              >
                Forgot Password?
              </button>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline w-full"
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
            </>
          )}
        </>
      )}
      {isSignUp && ( // Add back to login link for signup
        <button
          onClick={() => setIsSignUp(false)}
          className="text-blue-600 hover:underline w-full"
        >
          Already have an account? Login
        </button>
      )}
    </div>
  );
};

export default AuthForm;
