import React, { useState } from 'react';
import AuthForm from './AuthForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          {isForgotPassword
            ? "Reset Password"
            : isSignUp
            ? "Create Account"
            : "Welcome Back"}
        </h1>
        <p className="text-gray-500">
          {isForgotPassword
            ? "Enter your email to reset your password."
            : isSignUp
            ? "Sign up to start using the platform."
            : "Log in to your account."}
        </p>
        <AuthForm
          isSignUp={isSignUp}
          isForgotPassword={isForgotPassword}
          setIsForgotPassword={setIsForgotPassword}
          setIsSignUp={setIsSignUp}
        />
      </div>
    </div>
  );
};

export default Auth;
