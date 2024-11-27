import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const buttonStyles =
    "flex-1 bg-blue-500 text-white py-6 px-6 rounded shadow-lg text-lg font-bold hover:bg-blue-600 transition duration-300";

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-gray-200 p-8 rounded-lg shadow-3xl">
        <h1 className="text-2xl font-bold mb-8 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 w-80">
          <button
            className={buttonStyles}
            onClick={() => navigate("/inventory")}
          >
            Inventory
          </button>
          <button
            className={buttonStyles}
            onClick={() => navigate("/equipments")}
          >
            Equipments
          </button>
          <button
            className={buttonStyles}
            onClick={() => navigate("/sales")}
          >
            Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
