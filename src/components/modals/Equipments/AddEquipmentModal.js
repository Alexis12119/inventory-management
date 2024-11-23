import React, { useState } from "react";

const AddEquipmentModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [daysInterval, setDaysInterval] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, days_interval: daysInterval });
    onClose();
    setName("");
    setDaysInterval("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>{" "}
      <div className="bg-white rounded shadow-lg p-8  relative">
        {" "}
        <h2 className="text-xl font-bold mb-6">Add Equipment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Equipment Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full p-3"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block mb-2">Days Interval</label>
            <input
              type="number"
              value={daysInterval}
              onChange={(e) => setDaysInterval(e.target.value)}
              className="border rounded w-full p-3"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black py-3 px-6 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentModal;
