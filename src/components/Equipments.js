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
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add
        </button>
      </div>
      <div className="overflow-x-auto pb-14 pt-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b text-center">Equipment ID</th>
              <th className="py-2 px-4 border-b text-center">Equipment Name</th>
              <th className="py-2 px-4 border-b text-center">Days Interval</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equip) => (
              <tr key={equip.id} className="text-gray-600">
                <td className="py-2 px-4 border-b text-center">{equip.id}</td>
                <td className="py-2 px-4 border-b text-center">{equip.name}</td>
                <td className="py-2 px-4 border-b text-center">
                  {equip.days_interval}
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
                      <button
                        onClick={() => {
                          handleGenerateQRCode(equip);
                          toggleActionsMenu(equip.id);
                        }}
                        className="block w-full px-4 py-2 text-center text-gray-800 hover:bg-gray-200"
                      >
                        Generate QR
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
