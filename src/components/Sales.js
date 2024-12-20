import React, { useState } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import { supabase } from "./auth/supabaseClient";
import AddSalesModal from "./modals/Sales/AddSalesModal";
import EditSalesModal from "./modals/Sales/EditSalesModal";
import DeleteConfirmationModal from "./modals/Sales/DeleteConfirmationModal";
import PrintSlipModal from "./modals/Sales/PrintSlipModal";

const Sales = () => {
  const { data: salesRecords, refreshData } = useSupabaseData("sales");
  const { data: inventoryRecords } = useSupabaseData("inventory");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [recordsByIssuance, setRecordsByIssuance] = useState([]);

  const [pendingEntries, setPendingEntries] = useState([]);
  const [newORNumber, setNewORNumber] = useState("");
  const [shouldReset, setShouldReset] = useState(false);

  const determineItemType = (productId) => {
    const product = inventoryRecords.find((item) => item.id === productId);
    
    if (!product) {
      return ""; // Return empty string if product not found
    }

    // Logic to determine item type based on product name or other characteristics
    if (product.product_name && product.product_name.toLowerCase().includes("uniform")) {
      return "Uniform";
    } else if (product.product_name && product.product_name.toLowerCase().includes("proware")) {
      return "Proware";
    }
  }

  const fetchRecordsByIssuance = async (issuanceNumber) => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .eq("issuance_no", issuanceNumber);

    if (error) {
      console.error("Error fetching records by OR:", error.message);
    } else {
      setRecordsByIssuance(data);
      setShowPrintSlip(true); // Open the PrintSlipModal
    }
  };

  const handleCommitPendingEntries = async () => {
    console.log(pendingEntries);
    if (pendingEntries.length !== 0) {
      // Fetch current max issuance number
      let maxIssuanceNo = Math.max(
        0,
        ...salesRecords.map((record) => record.issuance_no || 0),
      );

      maxIssuanceNo = maxIssuanceNo + 1;
      // Add issuance numbers and OR number to each entry
      const entriesWithNumbers = pendingEntries.map((entry) => ({
        ...entry,
        issuance_no: maxIssuanceNo,
        or_number: newORNumber,
      }));

      // Insert into database
      await supabase.from("sales").insert(entriesWithNumbers);

      // Update inventory counts
      for (let entry of entriesWithNumbers) {
        const product = inventoryRecords.find(
          (item) => item.id === entry.product_id,
        );
        await supabase
          .from("inventory")
          .update({ item_count: product.item_count - entry.item_count })
          .match({ id: entry.product_id });
      }

      alert("Pending entries successfully committed.");

      setShouldReset(true);
      setTimeout(() => setShouldReset(false), 0);
      // Clear pending entries and refresh
      setPendingEntries([]);
      setNewORNumber("");
      refreshData();
    } else {
      alert("There are no entries to commit.");
    }
  };

  const handleAddToPending = (
    newProductId,
    newItemCount,
    studentName,
    studentId,
    courseAndSection,
  ) => {
    const product = inventoryRecords.find((item) => item.id === newProductId);

    if (!product) {
      alert("Invalid product ID.");
      return;
    }

    const finalItemType = determineItemType(newProductId);
    const itemCount = parseInt(newItemCount);
    if (itemCount > product.item_count) {
      alert("Item count exceeds available inventory.");
      return;
    }

    const amount = itemCount * product.price;

    setPendingEntries((prev) => [
      ...prev,
      {
        product_id: newProductId,
        item_count: itemCount,
        amount: amount,
        student_name: studentName,
        student_id: studentId,
        course_and_section: courseAndSection,
        item_type: finalItemType,
      },
    ]);

    alert("Item successfully added to the pending list.");
    refreshData();
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const filteredSalesRecords = salesRecords.filter((record) => {
      const recordDate = new Date(record.last_modified);

      const start = startDate ? new Date(startDate) : new Date(0); // Default to the earliest possible date
      const end = endDate ? new Date(endDate) : new Date(); // Default to current date

      if (start > end) {
        return false; // Invalid date range, no records should match
      }

      return recordDate >= start && recordDate <= end;
    });

    const grandTotal = filteredSalesRecords.reduce(
      (total, record) => total + record.amount,
      0,
    );

    const csvData = [
      [
        "Grand Total:",
        `${grandTotal.toFixed(2)}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "Date",
        "Issuance No.",
        "OR Number", // This matches your column heading
        "Issued To",
        "Student No.",
        "Course/Section",
        "Item Code", // This matches the "Item ID"
        "Item Count",
        "Item Type",
        "Amount",
      ],
      ...filteredSalesRecords.map((record) => {
        const product = inventoryRecords.find(
          (item) => item.id === record.product_id,
        );
        return [
          record.last_modified
            ? new Date(record.last_modified).toLocaleDateString() // Date only
            : "N/A",
          record.issuance_no, // Sales Item ID
          record.or_number || "N/A", // OR Number
          record.student_name || "N/A", // Issued To
          record.student_id || "N/A", // Student No.
          record.course_and_section || "N/A", // Course/Section
          product ? product.id : "N/A", // Item Code (Inventory ID)
          record ? record.item_count : "N/A", // Item Count
          product ? product.product_name : "N/A", // Item Type (assumed from product name)
          record.amount ? record.amount.toFixed(2) : "N/A", // Amount
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
    link.setAttribute("download", "sales_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = async (
    recordId,
    editItemCount,
    studentName,
    studentId,
    courseAndSection,
    orNumber,
    itemType,
  ) => {
    const record = salesRecords.find((rec) => rec.id === recordId);
    const product = inventoryRecords.find(
      (item) => item.id === record.product_id,
    );

    // Check if OR number already exists in other records
    if (orNumber) {
      const existingORNumber = salesRecords.some(
        (rec) => rec.id !== recordId && rec.or_number === orNumber,
      );

      if (existingORNumber) {
        alert("OR number must be unique across all records.");
        return;
      }
    }

    // Update all records with the same issuance number with the new OR number
    const recordsWithSameIssuance = salesRecords.filter(
      (rec) => rec.issuance_no === record.issuance_no,
    );

    const newItemCount = parseInt(editItemCount);
    const availableItemCount = product.item_count + record.item_count;

    if (newItemCount > availableItemCount) {
      alert("Item count exceeds available inventory.");
      return;
    }

    const amount = newItemCount * product.price;

    // Update the specific record
    await supabase
      .from("sales")
      .update({
        item_count: newItemCount,
        amount: amount,
        student_name: studentName,
        student_id: studentId,
        course_and_section: courseAndSection,
        last_modified: new Date(),
        item_type: itemType,
        or_number: orNumber,
      })
      .match({ id: recordId });

    // Update OR number for all records with the same issuance number
    if (orNumber) {
      await Promise.all(
        recordsWithSameIssuance.map((rec) =>
          supabase
            .from("sales")
            .update({ or_number: orNumber })
            .match({ id: rec.id }),
        ),
      );
    }

    // Update inventory
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
  const sortedSalesRecords = filteredSalesRecords.sort((a, b) => {
    return new Date(b.last_modified) - new Date(a.last_modified); // Sort by last_modified descending
  });

  const grandTotal = filteredSalesRecords.reduce(
    (total, record) => total + record.amount,
    0,
  );

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Issuance Transactions Module</h1>
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
            Add Sale Entry
          </button>
          {pendingEntries.length > 0 && (
            <button
              onClick={() => handleCommitPendingEntries()}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Finalize and Commit
            </button>
          )}
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
              <th className="py-2 px-4 border-b text-center">Date</th>
              <th className="py-2 px-4 border-b text-center">Issuance No.</th>
              <th className="py-2 px-4 border-b text-center">OR Number</th>
              <th className="py-2 px-4 border-b text-center">Issued To</th>
              <th className="py-2 px-4 border-b text-center">Student No.</th>
              <th className="py-2 px-4 border-b text-center">Course/Section</th>
              <th className="py-2 px-4 border-b text-center">Item Code</th>
              <th className="py-2 px-4 border-b text-center">Item Count</th>
              <th className="py-2 px-4 border-b text-center">Item Type</th>
              <th className="py-2 px-4 border-b text-center">Amount</th>
              <th className="py-2 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSalesRecords.map((record) => {
              return (
                <tr key={record.id} className="text-gray-600">
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(record.last_modified).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.issuance_no : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.or_number : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.student_name : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.student_id : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.course_and_section : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.product_id : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.item_count : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.item_type : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {record ? record.amount.toFixed(2) : "N/A"}
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
                        <button
                          onClick={() => {
                            fetchRecordsByIssuance(record.issuance_no);
                            setShowPrintSlip(true);
                            toggleActionsMenu(record.id);
                          }}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-center"
                        >
                          Print Slip
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mb-16"></div>
      </div>

      <AddSalesModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddToPending}
        inventoryRecords={inventoryRecords}
        shouldReset={shouldReset}
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

      <PrintSlipModal
        isOpen={showPrintSlip}
        onClose={() => setShowPrintSlip(false)}
        selectedRecord={recordsByIssuance}
        inventoryData={inventoryRecords}
      />
    </div>
  );
};

export default Sales;
