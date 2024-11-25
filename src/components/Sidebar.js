import React from "react";
import {
  FaTools,
  FaClipboardList,
  FaChartLine,
  FaWrench,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed inset-y-0 left-0 bg-gray-900 text-white flex flex-col justify-between transition-all duration-300 ease-in-out transform hover:translate-x-0 w-12 hover:w-60 group">
      <div className="flex-1 p-2 pt-8">
        <nav className="space-y-4">
          {/* Top buttons */}
          <button
            onClick={() => handleNavigation("/inventory")}
            className="flex items-center py-2 px-2 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FaClipboardList className="mr-2" />
            <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              Inventory
            </span>
          </button>
          <button
            onClick={() => handleNavigation("/sales")}
            className="flex items-center py-2 px-2 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FaChartLine className="mr-2" />
            <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              Issuance Transactions
            </span>
          </button>
          <button
            onClick={() => handleNavigation("/equipments")}
            className="flex items-center py-2 px-2 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FaTools className="mr-2" />
            <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              Equipments
            </span>
          </button>
          <button
            onClick={() => handleNavigation("/maintenance")}
            className="flex items-center py-2 px-2 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            <FaWrench className="mr-2" />
            <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              Maintenance
            </span>
          </button>
        </nav>
      </div>

      <div className="p-2 pb-8 space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center py-2 px-2 rounded hover:bg-red-600 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
