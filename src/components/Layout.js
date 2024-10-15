import React from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from './auth/supabaseClient';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("Logout failed. Please try again.");
      } else {
        window.location.href = "/";
      }
    }
  };

  // Update the condition to include signup and forgot password routes
  const shouldShowSidebar = !["/", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <div className="relative flex">
      {shouldShowSidebar && <Sidebar handleLogout={handleLogout} />}
      <div className="flex-1 ml-12 transition-all duration-300">
        <main className="p-6 bg-white">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
