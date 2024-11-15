import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import QRCodeModal from "./modals/QRCodeModal.js";
import { supabase } from "./auth/supabaseClient";
import html2canvas from "html2canvas";

const Inventory = () => {
  const { data: inventoryRecords, refreshData } = useSupabaseData("inventory");
  const [editItemId, setEditItemId] = useState(null);
  const [editRemarks, setRemarks] = useState("");
  const [editRecordId, setEditRecordId] = useState(null);
  const [editItemCount, setEditItemCount] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [editName, setEditName] = useState("");
  const [newItemId, setNewItemId] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCount, setNewItemCount] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const handleAdd = async () => {
    if (!newItemName || !newItemCount || !newItemPrice) {
      alert("Please enter item name, count, and price.");
      return;
    }

    if (parseInt(newItemCount) < 0) {
      alert("Item count cannot be negative.");
      return;
    }

    await supabase.from("inventory").insert({
      id: newItemId,
      product_name: newItemName,
      item_count: parseInt(newItemCount),
      price: parseFloat(newItemPrice),
      remarks: newRemarks,
    });

    refreshData();
    setNewItemId("");
    setNewItemName("");
    setNewItemCount("");
    setNewItemPrice("");
    setNewRemarks("");
    setShowAddForm(false);
  };

  const handleEditClick = (record) => {
    setEditRecordId(record.id);
    setEditItemId(record.id);
    setRemarks(record.remarks);
    setEditItemCount(record.item_count);
    setEditPrice(record.price);
    setEditName(record.product_name);
    setShowEditForm(true);
  };

  const toggleActionsMenu = (id) => {
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const handleSave = async (recordId) => {
    if (editItemCount === null || editPrice === null || !editName) {
      alert("Please enter item name, item count, and price.");
      return;
    }

    if (parseInt(editItemCount) < 0) {
      alert("Item count cannot be negative.");
      return;
    }

    const { data: existingItem, error: checkError } = await supabase
      .from("inventory")
      .select()
      .eq("id", editItemId)
      .neq("id", recordId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      alert("Error checking item ID: " + checkError.message);
      return;
    }

    if (existingItem) {
      alert("This item ID is already in use. Please choose a different ID.");
      return;
    }

    try {
      if (editItemId !== recordId) {
        const { error: insertError } = await supabase.from("inventory").insert({
          id: editItemId,
          remarks: editRemarks,
          product_name: editName,
          item_count: parseInt(editItemCount),
          price: parseFloat(editPrice),
        });

        if (insertError) throw insertError;

        const { error: salesError } = await supabase
          .from("sales")
          .update({ product_id: editItemId })
          .eq("product_id", recordId);

        if (salesError) throw salesError;

        const { error: deleteError } = await supabase
          .from("inventory")
          .delete()
          .eq("id", recordId);

        if (deleteError) throw deleteError;
      } else {
        const { error: updateError } = await supabase
          .from("inventory")
          .update({
            remarks: editRemarks,
            product_name: editName,
            item_count: parseInt(editItemCount),
            price: parseFloat(editPrice),
          })
          .eq("id", recordId);

        if (updateError) throw updateError;
      }

      refreshData();
      setEditRecordId(null);
      setShowEditForm(false);
    } catch (error) {
      alert("Error updating inventory: " + error.message);
      refreshData();
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await supabase.from("inventory").delete().match({ id: recordId });
    }
    refreshData(); // Refresh data to update the UI
  };

  const handleGenerateQRCode = (record) => {
    setQRCodeData(record);
    setShowQRCodeModal(true);
  };

  const handleDownload = async () => {
    const qrCodeElement = document.getElementById("qr-code");
    if (!qrCodeElement) return;

    const canvas = await html2canvas(qrCodeElement);
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${qrCodeData.product_name ? qrCodeData.product_name : "qrcode"}.png`;
    link.click();
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Item
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-80 max-w-xs">
            <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>
            <input
              type="text"
              value={newItemId}
              onChange={(e) => setNewItemId(e.target.value)}
              placeholder="Item ID"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item Name"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              value={newItemCount}
              onChange={(e) => setNewItemCount(e.target.value)}
              placeholder="Item Count"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              step="0.01"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="Price"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={newRemarks}
              onChange={(e) => setNewRemarks(e.target.value)}
              placeholder="Remarks"
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
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-80 max-w-xs">
            <h2 className="text-xl font-bold mb-4">Edit Inventory Item</h2>
            <input
              type="text"
              value={editItemId}
              onChange={(e) => setEditItemId(e.target.value)}
              placeholder="Item ID"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Item Name"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              value={editItemCount}
              onChange={(e) => setEditItemCount(e.target.value)}
              placeholder="Item Count"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              step="0.01"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="Price"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={editRemarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks"
              className="border p-2 mb-2 w-full"
            />
            <button
              onClick={() => {
                handleSave(editRecordId);
                setShowEditForm(false);
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pb-10 pt-3">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b text-center">Item ID</th>
              <th className="py-2 px-4 border-b text-center">Item Name</th>
              <th className="py-2 px-4 border-b text-center">Item Count</th>
              <th className="py-2 px-4 border-b text-center">Price</th>
              <th className="py-2 px-4 border-b text-center">Last Modified</th>
              <th className="py-2 px-4 border-b text-center">Remarks</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryRecords.map((record) => (
              <tr key={record.id} className="text-gray-600">
                <td className="py-2 px-4 border-b text-center">{record.id}</td>
                <td className="py-2 px-4 border-b text-center">
                  {record.product_name}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.item_count}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  ₱{record.price.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.last_modified
                    ? new Date(record.last_modified).toLocaleString()
                    : "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {record.remarks}
                </td>
                <td className="py-2 px-4 border-b text-center relative">
                  <button
                    onClick={() => toggleActionsMenu(record.id)}
                    className="bg-gray-300 text-black py-1 px-2 rounded"
                  >
                    •••
                  </button>
                  {showActionsMenu === record.id && (
                    <div
                      className="absolute left-[-170px] top-[-40px] w-48 bg-white border border-gray-300 rounded shadow-lg z-50" // Set high z-index
                      style={{ minWidth: "150px" }}
                    >
                      <button
                        onClick={() => {
                          handleEditClick(record);
                          toggleActionsMenu(record.id);
                        }}
                        className="text-center block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(record.id);
                          toggleActionsMenu(record.id);
                        }}
                        className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-center"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          handleGenerateQRCode(record);
                          toggleActionsMenu(record.id);
                        }}
                        className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200 text-center"
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

      {showQRCodeModal && qrCodeData && (
        <QRCodeModal
          isOpen={showQRCodeModal}
          onClose={() => setShowQRCodeModal(false)}
          data={qrCodeData}
          name={qrCodeData.product_name}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default Inventory;
