import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import { supabase } from "./auth/supabaseClient";

const Maintenance = () => {
  const { data: maintenanceRecords, refreshData } =
    useSupabaseData("maintenance");
  const { data: equipments } = useSupabaseData("equipments");
  const [editRecordId] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const [newEquipmentId, setNewEquipmentId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipmentDescription, setNewEquipmentDescription] = useState("");

  // Find the equipment based on the provided ID
  const findEquipment = (id) => {
    const equipment = equipments.find((eq) => eq.id === parseInt(id));
    return equipment || {};
  };

  const handleAdd = async () => {
    if (!newEquipmentId) {
      alert("Please select an equipment.");
      return;
    }

    const equipment = findEquipment(newEquipmentId);
    if (!equipment.id) {
      alert("Invalid equipment selected.");
      return;
    }

    // Insert new maintenance record with the current date
    await supabase.from("maintenance").insert({
      equipment_id: equipment.id,
      equipment_name: equipment.name,
      equipment_description: equipment.description,
      date_maintained: new Date().toISOString().split("T")[0], // Set current date
    });

    refreshData();

    // Reset form fields and hide form
    setNewEquipmentId("");
    setShowAddForm(false);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await supabase.from("maintenance").delete().match({ id: recordId });
    }
    refreshData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Maintenance Scheduling</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-80 max-w-xs">
            <h2 className="text-xl font-bold mb-4">Add Maintenance Record</h2>
            {/* Dropdown to select equipment */}
            <select
              value={newEquipmentId}
              onChange={(e) => setNewEquipmentId(e.target.value)}
              className="border p-2 mb-2 w-full"
            >
              <option value="" disabled>
                Select Equipment
              </option>
              {equipments.map((equipment) => (
                <option key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newEquipmentDescription}
              onChange={(e) => setNewEquipmentDescription(e.target.value)}
              placeholder="Equipment Description"
              className="border p-2 mb-2 w-full"
            />

            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b text-center">Equipment Name</th>
              <th className="py-2 px-4 border-b text-center">
                Equipment Description
              </th>
              <th className="py-2 px-4 border-b text-center">
                Date Maintained
              </th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceRecords.map((record) => (
              <tr key={record.id} className="text-gray-600">
                <td className="py-2 px-4 border-b text-center">
                  {record.equipment_name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.equipment_description}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {editRecordId === record.id ? (
                    <DatePicker
                      selected={editDate}
                      onChange={(date) => setEditDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="border p-1 w-24"
                    />
                  ) : (
                    record.date_maintained
                  )}
                </td>
                <td className="py-2 px-4 border-b space-x-2 space-y-2 text-center">
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
