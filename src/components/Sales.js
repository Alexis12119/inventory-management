import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import { supabase } from "./auth/supabaseClient";
import AddSalesModal from './modals/Sales/AddSalesModal';
import EditSalesModal from './modals/Sales/EditSalesModal';
import DeleteConfirmationModal from './modals/Sales/DeleteConfirmationModal';

const Sales = () => {
  const { data: salesRecords } = useSupabaseData("sales");
  const { data: inventoryRecords } = useSupabaseData("inventory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const handleAdd = async (newProductId, newItemCount) => {
    const product = inventoryRecords.find(
      (item) => item.id === parseInt(newProductId)
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

    const amount = itemCount * product.price;

    await supabase.from("sales").insert({
      product_id: product.id,
      item_count: itemCount,
      amount: amount,
    });

    await supabase
      .from("inventory")
      .update({ item_count: product.item_count - itemCount })
      .match({ id: product.id });

    setShowAddModal(false);
  };

  const handleEdit = async (recordId, editItemCount) => {
    const record = salesRecords.find((rec) => rec.id === recordId);
    const product = inventoryRecords.find(
      (item) => item.id === record.product_id
    );

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
        last_modified: new Date(),
      })
      .match({ id: recordId });

    await supabase
      .from("inventory")
      .update({
        item_count: product.item_count + record.item_count - newItemCount,
      })
      .match({ id: record.product_id });

    setShowEditModal(false);
  };

  const handleDelete = async () => {
    const record = salesRecords.find((rec) => rec.id === deleteItemId);
    const product = inventoryRecords.find(
      (item) => item.id === record.product_id
    );

    await supabase.from("sales").delete().match({ id: deleteItemId });

    await supabase
      .from("inventory")
      .update({ item_count: product.item_count + record.item_count })
      .match({ id: product.id });

    setShowDeleteModal(false);
  };

  const toggleActionsMenu = (id) => {
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Records</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Sale
        </button>
      </div>

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
                (item) => item.id === record.product_id
              );
              return (
                <tr key={record.id} className="text-gray-600">
                  <td className="py-2 px-4 border-b text-center">
                    {product ? product.product_name : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record.item_count}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    ₱{record.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record.last_modified
                      ? new Date(record.last_modified).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center relative">
                    <button
                      onClick={() => toggleActionsMenu(record.id)}
                      className="bg-gray-300 text-black py-1 px-2 rounded"
                    >
                      •••
                    </button>
                    {showActionsMenu === record.id && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditItem(record);
                            setShowEditModal(true);
                            toggleActionsMenu(record.id);
                          }}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteItemId(record.id);
                            setShowDeleteModal(true);
                            toggleActionsMenu(record.id);
                          }}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddSalesModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
        inventoryRecords={inventoryRecords}
      />

      <EditSalesModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={editItem}
        onEdit={handleEdit}
        inventoryRecords={inventoryRecords}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Sales;
