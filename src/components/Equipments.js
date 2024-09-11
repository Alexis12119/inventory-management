import AddEquipmentModal from './modals/AddEquipmentModal';
import EditEquipmentModal from './modals/EditEquipmentModal';
import QRCodeModal from './modals/QRCodeModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import React, { useState } from "react";
import useSupabaseData from '../hooks/useSupabaseData';
import { supabase } from './auth/supabaseClient.js';

const Equipments = () => {
  const { data: equipments } = useSupabaseData("equipments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);

  const handleDelete = async () => {
    await supabase
      .from("maintenance")
      .delete()
      .match({ equipment_id: deleteItemId });
    await supabase.from("equipments").delete().match({ id: deleteItemId });

    setShowDeleteModal(false);
  };

  const handleGenerateQRCode = (equipment) => {
    setQRCodeData(equipment);
    setShowQRCodeModal(true);
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b text-center">Equipment ID</th>
              <th className="py-2 px-4 border-b text-center">Equipment Name</th>
              <th className="py-2 px-4 border-b text-center">Days Interval </th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equip) => (
              <tr key={equip.id} className="text-gray-600">
                <td className="py-2 px-4 border-b text-center">{equip.id}</td>
                <td className="py-2 px-4 border-b text-center">{equip.name}</td>
                <td className="py-2 px-4 border-b text-center">{equip.days_interval}</td>
                <td className="py-2 px-4 border-b space-x-2 space-y-2 text-center">
                  <button
                    onClick={() => {
                      setEditItem(equip);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteItemId(equip.id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleGenerateQRCode(equip)}
                    className="bg-green-500 text-white py-1 px-2 rounded"
                  >
                    Generate QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditEquipmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={editItem}
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
