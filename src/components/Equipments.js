import AddEquipmentModal from "./modals/Equipments/AddEquipmentModal";
import EditEquipmentModal from "./modals/Equipments/EditEquipmentModal";
import QRCodeModal from "./modals/QRCodeModal";
import DeleteConfirmationModal from "./modals/Equipments/DeleteConfirmationModal";
import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import { supabase } from "./auth/supabaseClient.js";

const Equipments = () => {
  const { data: equipments, refreshData } = useSupabaseData("equipments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const handleAdd = async (data) => {
    await supabase.from("equipments").insert(data);
    refreshData();
  };

  const handleExportCSV = () => {
    const filteredEquipments = equipments.filter((record) => {
      const recordDate = new Date(record.date_acquired);
      return recordDate;
    });

    const csvData = [
      [
        "Equipment ID",
        "Equipment Name",
        "Equipment Description",
        "Brand",
        "Model",
        "Serial",
        "Major Category",
        "Minor Category",
        "Quantity",
        "OuM",
        "Unit Cost",
        "Location",
        "Condition",
        "Date Acquired",
      ],
      ...filteredEquipments.map((record) => {
        return [
          record.id,
          record.name,
          record.description,
          record.brand,
          record.model,
          record.serial,
          record.major_category,
          record.minor_category,
          record.quantity,
          record.oum,
          record.unit_cost,
          record.location,
          record.condition,
          record.date_acquired,
        ];
      }),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "equipments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = async (data) => {
    const { id, name } = data;

    const { error } = await supabase
      .from("equipments")
      .update(data)
      .match({ id });

    if (error) {
      alert("Error updating equipment: " + error.message);
      return;
    }

    const { error: maintenanceError } = await supabase
      .from("maintenance")
      .update({ equipment_name: name })
      .match({ equipment_id: id });

    refreshData();
    if (maintenanceError) {
      alert("Error updating maintenance records: " + maintenanceError.message);
    }
  };

  const handleDelete = async () => {
    await supabase
      .from("maintenance")
      .delete()
      .match({ equipment_id: deleteItemId });
    await supabase.from("equipments").delete().match({ id: deleteItemId });

    refreshData();
    setShowDeleteModal(false);
  };

  const handleGenerateQRCode = (equipment) => {
    setQRCodeData(equipment);
    setShowQRCodeModal(true);
  };

  const toggleActionsMenu = (id) => {
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Equipments</h1>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Export as CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto pb-14 pt-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b text-center">Equipment ID</th>
              <th className="py-2 px-4 border-b text-center">Equipment Name</th>
              <th className="py-2 px-4 border-b text-center">
                Equipment Description
              </th>
              <th className="py-2 px-4 border-b text-center">Brand</th>
              <th className="py-2 px-4 border-b text-center">Model</th>
              <th className="py-2 px-4 border-b text-center">Serial</th>
              <th className="py-2 px-4 border-b text-center">Major Category</th>
              <th className="py-2 px-4 border-b text-center">Minor Category</th>
              <th className="py-2 px-4 border-b text-center">Quantity</th>
              <th className="py-2 px-4 border-b text-center">OUM</th>
              <th className="py-2 px-4 border-b text-center">Unit Cost</th>
              <th className="py-2 px-4 border-b text-center">Location</th>
              <th className="py-2 px-4 border-b text-center">Condition</th>
              <th className="py-2 px-4 border-b text-center">Date Acquired</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equip) => (
              <tr key={equip.id} className="text-gray-600">
                <td className="py-2 px-4 border-b text-center">{equip.id}</td>
                <td className="py-2 px-4 border-b text-center">{equip.name}</td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.description}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.brand}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.model}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.serial}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.major_category}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.minor_category}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.quantity}
                </td>
                <td className="py-2 px-4 border-b text-center">{equip.oum}</td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.unit_cost}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.location}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.condition}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.date_acquired}
                </td>
                <td className="py-2 px-4 border-b text-center relative">
                  <button
                    onClick={() => toggleActionsMenu(equip.id)}
                    className="bg-gray-300 text-black py-1 px-2 rounded"
                  >
                    •••
                  </button>
                  {showActionsMenu === equip.id && (
                    <div className="absolute left-[-150px] top-[-50px] w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
                      <button
                        onClick={() => {
                          setEditItem(equip);
                          setShowEditModal(true);
                          toggleActionsMenu(equip.id);
                        }}
                        className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItemId(equip.id);
                          setShowDeleteModal(true);
                          toggleActionsMenu(equip.id);
                        }}
                        className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      <EditEquipmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleEdit}
        equipment={editItem}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />

      <QRCodeModal
        isOpen={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        data={qrCodeData}
        name={qrCodeData ? qrCodeData.name : ""}
      />
    </div>
  );
};

export default Equipments;
