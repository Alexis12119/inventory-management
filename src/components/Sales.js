import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import { supabase } from "./auth/supabaseClient";
import AddSalesModal from "./modals/Sales/AddSalesModal";
import EditSalesModal from "./modals/Sales/EditSalesModal";
import DeleteConfirmationModal from "./modals/Sales/DeleteConfirmationModal";

const Sales = () => {
  const { data: salesRecords, refreshData } = useSupabaseData("sales");
  const { data: inventoryRecords } = useSupabaseData("inventory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);

  const handleExportCSV = () => {
    const filteredSalesRecords = salesRecords.filter((record) => {
      const recordDate = new Date(record.last_modified);

      // Ensure start and end dates are valid or fallback to default values
      const start = startDate ? new Date(startDate) : new Date(0); // Default to the earliest possible date
      const end = endDate ? new Date(endDate) : new Date(); // Default to current date

      // Check if the record's last modified date is within the valid date range
      // Ensure the start date isn't after the end date, otherwise reset
      if (start > end) {
        return false; // Invalid date range, no records should match
      }

      // If both dates are set, check if record date is between them
      return recordDate >= start && recordDate <= end;
    });

    const grandTotal = filteredSalesRecords.reduce(
      (total, record) => total + record.amount,
      0,
    );

    const csvData = [
      ["Grand Total:", `₱${grandTotal.toFixed(2)}`, "", ""],
      ["Item Name", "Item Count", "Price Amount", "Last Modified"],
      ...filteredSalesRecords.map((record) => {
        const product = inventoryRecords.find(
          (item) => item.id === record.product_id,
        );
        return [
          product ? product.product_name : "N/A",
          record.item_count,
          `₱${record.amount.toFixed(2)}`,
          record.last_modified
            ? new Date(record.last_modified).toLocaleString()
            : "N/A",
        ];
      }),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdd = async (newProductId, newItemCount, studentId) => {
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

    const amount = itemCount * product.price;

    await supabase.from("sales").insert({
      product_id: product.id,
      item_count: itemCount,
      amount: amount,
      student_id: studentId,
    });

    await supabase
      .from("inventory")
      .update({ item_count: product.item_count - itemCount })
      .match({ id: product.id });

    refreshData();
    setShowAddModal(false);
  };

  const handleEdit = async (recordId, editItemCount, studentId) => {
    const record = salesRecords.find((rec) => rec.id === recordId);
    const product = inventoryRecords.find(
      (item) => item.id === record.product_id,
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
        student_id: studentId,
        last_modified: new Date(),
      })
      .match({ id: recordId });

    await supabase
      .from("inventory")
      .update({
        item_count: product.item_count + record.item_count - newItemCount,
      })
      .match({ id: record.product_id });

    refreshData();
    setShowEditModal(false);
  };

  const handleDelete = async () => {
    const record = salesRecords.find((rec) => rec.id === deleteItemId);
    const product = inventoryRecords.find(
      (item) => item.id === record.product_id,
    );

    await supabase.from("sales").delete().match({ id: deleteItemId });

    await supabase
      .from("inventory")
      .update({ item_count: product.item_count + record.item_count })
      .match({ id: product.id });

    refreshData();
    setShowDeleteModal(false);
  };

  const toggleActionsMenu = (id) => {
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  // Filter sales records by the selected date range
  const filteredSalesRecords = salesRecords.filter((record) => {
    const recordDate = new Date(record.last_modified);

    // Ensure start and end dates are valid or fallback to default values
    const start = startDate ? new Date(startDate) : new Date(0); // Default to the earliest possible date
    const end = endDate ? new Date(endDate) : new Date(); // Default to current date

    // Check if the record's last modified date is within the valid date range
    // Ensure the start date isn't after the end date, otherwise reset
    if (start > end) {
      return false; // Invalid date range, no records should match
    }

    // If both dates are set, check if record date is between them
    return recordDate >= start && recordDate <= end;
  });

  const grandTotal = filteredSalesRecords.reduce(
    (total, record) => total + record.amount,
    0,
  );

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales Records</h1>
        <div className="flex space-x-2 items-center">
          <button
            onClick={() => setShowDateRangeModal(true)}
            className="bg-gray-300 text-black py-2 px-4 rounded"
          >
            Select Date Range
          </button>

          <div className="text-right py-2 px-4 bg-gray-200 rounded">
            <span className="text-xl font-semibold">
              Grand Total: ₱{grandTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Sale
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Export as CSV
          </button>
        </div>
      </div>

      {showDateRangeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="py-2 px-4 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="py-2 px-4 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDateRangeModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pb-4 pt-3">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b text-center">Student ID</th>
              <th className="py-2 px-4 border-b text-center">Item Name</th>
              <th className="py-2 px-4 border-b text-center">Item Count</th>
              <th className="py-2 px-4 border-b text-center">Price Amount</th>
              <th className="py-2 px-4 border-b text-center">Last Modified</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesRecords.map((record) => {
              const product = inventoryRecords.find(
                (item) => item.id === record.product_id,
              );
              return (
                <tr key={record.id} className="text-gray-600">
                  <td className="py-2 px-4 border-b text-center">
                    {record.student_id}
                  </td>
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
                      <div className="absolute left-[-170px] top-[-10px] w-48 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditItem(record);
                            setShowEditModal(true);
                            toggleActionsMenu(record.id);
                          }}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteItemId(record.id);
                            setShowDeleteModal(true);
                            toggleActionsMenu(record.id);
                          }}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-center"
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
