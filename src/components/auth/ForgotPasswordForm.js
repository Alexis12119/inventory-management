import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://inventory-management-rust-mu.vercel.app/reset-password',
    });


    if (error) {
      setMessage('Error sending reset email: ' + error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <label>Email:</label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <button type="submit">Send Reset Email</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ForgotPasswordForm;
