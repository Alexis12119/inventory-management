import React, { useState } from 'react';

const AddSalesModal = ({ isOpen, onClose, onAdd, inventoryRecords }) => {
  const [newProductId, setNewProductId] = useState("");
  const [newItemCount, setNewItemCount] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add Sales Record</h2>
        <select
          value={newProductId}
          onChange={(e) => setNewProductId(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Product</option>
          {inventoryRecords.map((item) => (
            <option key={item.id} value={item.id}>
              {item.product_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={newItemCount}
          onChange={(e) => setNewItemCount(e.target.value)}
          placeholder="Item Count"
          className="border p-2 mb-2 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={() => onAdd(newProductId, newItemCount)}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSalesModal;
