import React, { useState, useEffect } from "react";

const EditSalesModal = ({
  isOpen,
  onClose,
  item,
  onEdit,
  inventoryRecords,
}) => {
  const [editItemCount, setEditItemCount] = useState("");
  const [editIssuanceNo, setEditIssuanceNo] = useState("");
  const [editRemarks, setRemarks] = useState("");
  const [editStudentName, setEditStudentName] = useState("");
  const [editORNumber, setEditORNumber] = useState("");
  const [editStudentId, setEditStudentId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editItemType, setEditItemType] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCourseAndSection, setEditCourseAndSection] = useState("");

  useEffect(() => {
    if (item) {
      setEditItemCount(item.item_count.toString());
      setEditStudentName(item.student_name || "");
      setRemarks(item.remarks || "");
      setEditORNumber(item.cr_number || "");
      setEditStudentId(item.student_id || "");
      setEditCourseAndSection(item.course_and_section || "");
      setEditDescription(item.item_desc || "");
      setEditItemType(item.item_type || "");
      setEditAmount(item.amount.toString());
      setEditIssuanceNo(item.issuance_no || "");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const product = inventoryRecords.find((inv) => inv.id === item.product_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">Edit Sales Record</h2>
        <p>Product: {product ? product.product_name : "N/A"}</p>
        <input
          type="number"
          value={editItemCount}
          onChange={(e) => setEditItemCount(e.target.value)}
          placeholder="Item Count"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editIssuanceNo}
          onChange={(e) => setEditIssuanceNo(e.target.value)}
          placeholder="Issuance No"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editStudentName}
          onChange={(e) => setEditStudentName(e.target.value)}
          placeholder="Issued to"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editStudentId}
          onChange={(e) => setEditStudentId(e.target.value)}
          placeholder="Student ID"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editCourseAndSection}
          onChange={(e) => setEditCourseAndSection(e.target.value)}
          placeholder="Course and Section"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editRemarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 mb-2 w-full"
        />
        <select
          value={editItemType}
          onChange={(e) => setEditItemType(e.target.value)}
          className="border p-2 mb-2 w-full"
        >
          <option value="">Select Item Type</option>
          <option value="Proware">Proware</option>
          <option value="Uniform">Uniform</option>
        </select>
        <input
          type="text"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          placeholder="Amount"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={editORNumber}
          onChange={(e) => setEditORNumber(e.target.value)}
          placeholder="OR Number"
          className="border p-2 mb-2 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={() =>
              onEdit(
                item.id,
                editItemCount,
                editIssuanceNo,
                editStudentName,
                editStudentId,
                editCourseAndSection,
                editRemarks,
                editDescription,
                editItemType,
                editAmount,
                editORNumber,
              )
            }
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
