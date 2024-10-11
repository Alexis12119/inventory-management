import React, { useState, useEffect } from 'react';

const EditSalesModal = ({ isOpen, onClose, item, onEdit, inventoryRecords }) => {
  const [editItemCount, setEditItemCount] = useState("");

  useEffect(() => {
    if (item) {
      setEditItemCount(item.item_count.toString());
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const product = inventoryRecords.find((inv) => inv.id === item.product_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Edit Sales Record</h2>
        <p>Product: {product ? product.product_name : 'N/A'}</p>
        <input
          type="number"
          value={editItemCount}
          onChange={(e) => setEditItemCount(e.target.value)}
          placeholder="Item Count"
          className="border p-2 mb-2 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={() => onEdit(item.id, editItemCount)}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
          >
            Save
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

export default EditSalesModal;
