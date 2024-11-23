import React, { useState, useEffect } from "react";

const EditEquipmentModal = ({ isOpen, onClose, onEdit, equipment }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [days_interval, setDaysInterval] = useState("");

  useEffect(() => {
    if (equipment) {
      setName(equipment.name || "");
      setDescription(equipment.description || "");
      setDaysInterval(equipment.days_interval || "");
    }
  }, [equipment]);

  const handleEdit = async () => {
    if (!name) {
      alert("Please fill out all fields.");
      return;
    }

    await onEdit({
      id: equipment.id,
      name,
      description,
      days_interval,
    });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded w-80 max-w-xs">
        <h2 className="text-xl font-bold mb-4">Edit Equipment</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Equipment Name"
          className="border p-2 mb-4 w-full"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Equipment Description"
          className="border p-2 mb-4 w-full"
        />
        <input
          type="text"
          value={days_interval}
          onChange={(e) => setDaysInterval(e.target.value)}
          placeholder="Days Interval"
          className="border p-2 mb-4 w-full"
        />
        <button
          onClick={handleEdit}
          className="text-white py-2 px-4 rounded bg-yellow-500"
        >
          Save
        </button>
        <button onClick={onClose} className="ml-4 py-2 px-4 rounded border">
          Cancel
        </button>
      </div>
    </div>
  ) : null;
};

export default EditEquipmentModal;
