import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import { supabase } from "./auth/supabaseClient";

const Sales = () => {
  const { data: salesRecords } = useSupabaseData("sales");
  const { data: inventoryRecords } = useSupabaseData("inventory");
  const [editRecordId, setEditRecordId] = useState(null);
  const [editItemCount, setEditItemCount] = useState(null);
  const [newProductId, setNewProductId] = useState("");
  const [newItemCount, setNewItemCount] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = async () => {
    if (!newProductId || !newItemCount) {
      alert("Please enter product ID and count.");
      return;
    }

    const product = inventoryRecords.find(
      (item) => item.id === parseInt(newProductId),
    );
    if (!product) {
      alert("Invalid product ID.");
      return;
    }

    const itemCount = parseInt(newItemCount);
    if (itemCount > product.item_count) {
      alert("Item count exceeds available inventory.");
      return;
    }

    const amount = parseInt(newItemCount) * product.price;

    await supabase.from("sales").insert({
      product_id: product.id,
      item_count: parseInt(newItemCount),
      amount: amount,
    });

    // Update inventory item count
    await supabase
      .from("inventory")
      .update({ item_count: product.item_count - parseInt(newItemCount) })
      .match({ id: product.id });

    // Reset form fields and hide form
    setNewProductId("");
    setNewItemCount("");
    setShowAddForm(false);
  };

  const handleEditClick = (record) => {
    setEditRecordId(record.id);
    setEditItemCount(record.item_count);
  };

  const handleSave = async (recordId) => {
    if (editItemCount === null) {
      alert("Please enter an item count.");
      return;
    }

    const record = salesRecords.find((rec) => rec.id === recordId);
    const product = inventoryRecords.find(
      (item) => item.id === record.product_id,
    );

    // Calculate the new item count for inventory
    const newItemCount = parseInt(editItemCount);
    const availableItemCount = product.item_count + record.item_count;

    if (newItemCount > availableItemCount) {
      alert("Item count exceeds available inventory.");
      return;
    }

    const amount = newItemCount * product.price;

    await supabase
      .from("sales")
      .update({
        item_count: newItemCount,
        amount: amount,
        last_modified: new Date(), // Set the last modified date to current
      })
      .match({ id: recordId });

    // Update inventory item count
    await supabase
      .from("inventory")
      .update({
        item_count: product.item_count + record.item_count - newItemCount,
      })
      .match({ id: record.product_id });

    setEditRecordId(null);
  };

  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const record = salesRecords.find((rec) => rec.id === recordId);
      const product = inventoryRecords.find(
        (item) => item.id === record.product_id,
      );

      await supabase.from("sales").delete().match({ id: recordId });

      // Update inventory item count
      await supabase
        .from("inventory")
        .update({ item_count: product.item_count + record.item_count })
        .match({ id: product.id });
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Records</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Sale
        </button>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-80 max-w-xs">
            <h2 className="text-xl font-bold mb-4">Add Sales Record</h2>
            <input
              type="text"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              placeholder="Product ID"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              value={newItemCount}
              onChange={(e) => setNewItemCount(e.target.value)}
              placeholder="Item Count"
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
              <th className="py-2 px-4 border-b text-center">Item Name</th>
              <th className="py-2 px-4 border-b text-center">Item Count</th>
              <th className="py-2 px-4 border-b text-center">Price Amount</th>
              <th className="py-2 px-4 border-b text-center">Last Modified</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesRecords.map((record) => {
              const product = inventoryRecords.find(
                (item) => item.id === record.product_id,
              );
              return (
                <tr key={record.id} className="text-gray-600">
                  <td className="py-2 px-4 border-b text-center">
                    {product ? product.product_name : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {editRecordId === record.id ? (
                      <input
                        type="number"
                        value={editItemCount}
                        onChange={(e) => setEditItemCount(e.target.value)}
                        className="border p-1 w-24"
                      />
                    ) : (
                      record.item_count
                    )}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {editRecordId === record.id
                      ? `₱${(editItemCount * (product ? product.price : 0)).toFixed(2)}`
                      : `₱${record.amount.toFixed(2)}`}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record.last_modified
                      ? new Date(record.last_modified).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2 space-y-2 text-center">
                    {editRecordId === record.id ? (
                      <button
                        onClick={() => handleSave(record.id)}
                        className="bg-green-500 text-white py-1 px-3 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(record)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
