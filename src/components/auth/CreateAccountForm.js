import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const CreateAccountForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Account created sucessfully. Please check your email account to confirm.");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Create an Account</h2> {/* Updated Title */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
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
          {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
        </div>
      </div>
      <button
        onClick={handleCreateAccount}
        className="bg-blue-600 text-white py-3 px-6 rounded-full w-full hover:bg-blue-700 transition duration-300 font-semibold"
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate('/')}
        className="text-blue-600 hover:underline w-full"
      >
        Back to Log in
      </button>
    </div>
  );
};

export default CreateAccountForm;
