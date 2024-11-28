import React, { useState, useEffect, useRef } from "react";
import useSupabaseData from "../hooks/useSupabaseData";
import QRCodeModal from "./modals/QRCodeModal.js";
import { supabase } from "./auth/supabaseClient";
import html2canvas from "html2canvas";

const InventorySearch = ({ searchTerm, setSearchTerm, inventoryRecords }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Generate unique suggestion list from inventory records
  const generateSuggestions = () => {
    // Combine unique product names and IDs
    const uniqueSuggestions = [
      ...new Set([
        ...inventoryRecords.map((record) => record.product_name),
        ...inventoryRecords.map((record) => record.id),
      ]),
    ];

    return uniqueSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Generate and show suggestions if input is not empty
    if (value.trim()) {
      const filteredSuggestions = generateSuggestions();
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "Tab":
        e.preventDefault();

        // Cycle through suggestions
        const newIndex = e.shiftKey
          ? activeSuggestionIndex > 0
            ? activeSuggestionIndex - 1
            : suggestions.length - 1
          : activeSuggestionIndex < suggestions.length - 1
            ? activeSuggestionIndex + 1
            : 0;

        setActiveSuggestionIndex(newIndex);

        // Update search term with the active suggestion
        if (suggestions[newIndex]) {
          setSearchTerm(suggestions[newIndex]);
        }
        break;

      case "Enter":
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          setSearchTerm(suggestions[activeSuggestionIndex]);
          setShowSuggestions(false);
        }
        break;

      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  // Handle clicks outside of input and suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchTerm.trim()) {
            const filteredSuggestions = generateSuggestions();
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
          }
        }}
        placeholder="Search... (Tab/Shift+Tab to cycle suggestions)"
        className="border p-2 rounded w-64"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionRef}
          className="absolute z-10 w-64 bg-white border border-gray-300 rounded mt-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`p-2 hover:bg-gray-100 cursor-pointer ${
                index === activeSuggestionIndex ? "bg-gray-200" : ""
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Inventory = () => {
  const { data: inventoryRecords, refreshData } = useSupabaseData("inventory");
  const [editItemId, setEditItemId] = useState(null);
  const [editRemarks, setRemarks] = useState("");
  const [editRecordId, setEditRecordId] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [editName, setEditName] = useState("");
  const [newItemId, setNewItemId] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newSerial, setNewSerial] = useState("");
  const [newMajorCategory, setNewMajorCategory] = useState("");
  const [newMinorCategory, setNewMinorCategory] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editSerial, setEditSerial] = useState("");
  const [editMajorCategory, setEditMajorCategory] = useState("");
  const [editMinorCategory, setEditMinorCategory] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCount, setNewItemCount] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [additionalStock, setAdditionalStock] = useState("");
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered inventory records based on search term
  const filteredRecords = inventoryRecords.filter((record) =>
    `${record.id} ${record.product_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleAddStockClick = (recordId) => {
    setCurrentRecordId(recordId);
    setAdditionalStock("");
    setShowAddStockModal(true);
  };

  const handleAddStock = async () => {
    if (!additionalStock || parseInt(additionalStock) <= 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    try {
      // Fetch the current record to get the current stock count
      const { data: currentRecord, error: fetchError } = await supabase
        .from("inventory")
        .select("item_count")
        .eq("id", currentRecordId)
        .single();

      if (fetchError) throw fetchError;

      // Calculate the new stock count (current stock + additional stock)
      const newStockCount =
        currentRecord.item_count + parseInt(additionalStock);

      // Update the stock count in the database
      const { data, error } = await supabase
        .from("inventory")
        .update({
          item_count: newStockCount,
        })
        .eq("id", currentRecordId);

      if (error) throw error;

      alert("Stock added successfully!");
      refreshData(); // Refresh the inventory data
      setShowAddStockModal(false);
    } catch (error) {
      alert("Error adding stock: " + error.message);
    }
  };

  const handleAdd = async () => {
    if (!newItemId || !newItemName || !newItemCount || !newItemPrice) {
      alert("Please enter item ID, name, count, and price.");
      return;
    }

    if (parseInt(newItemCount) < 0) {
      alert("Item count cannot be negative.");
      return;
    }

    // Check if the Item ID already exists
    const { data: existingItem, error: checkError } = await supabase
      .from("inventory")
      .select("id")
      .eq("id", newItemId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      alert("Error checking item ID: " + checkError.message);
      return;
    }

    if (existingItem) {
      alert("Item ID already exists. Please choose a different ID.");
      return;
    }

    // Proceed with adding the new item
    const { error: insertError } = await supabase.from("inventory").insert({
      id: newItemId,
      product_name: newItemName,
      item_description: newDescription,
      item_count: parseInt(newItemCount),
      price: parseFloat(newItemPrice),
      remarks: newRemarks,
    });

    if (insertError) {
      alert("Error adding item: " + insertError.message);
      return;
    }

    refreshData();
    setNewItemId("");
    setNewItemName("");
    setNewItemCount("");
    setNewItemPrice("");
    setNewRemarks("");
    setNewDescription("");
    setNewBrand("");
    setNewModel("");
    setNewSerial("");
    setNewMajorCategory("");
    setNewMinorCategory("");
    setNewLocation("");
    setShowAddForm(false);
  };

  const handleEditClick = (record) => {
    setEditRecordId(record.id);
    setEditItemId(record.id);
    setRemarks(record.remarks);
    setEditPrice(record.price);
    setEditName(record.product_name);
    setEditDescription(record.item_description);
    setEditBrand(record.brand);
    setEditModel(record.model);
    setEditSerial(record.serial);
    setEditMajorCategory(record.major_category);
    setEditMinorCategory(record.minor_category);
    setEditLocation(record.location);
    setShowEditForm(true);
  };

  const toggleActionsMenu = (id) => {
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const handleSave = async (recordId) => {
    if (editPrice === null || !editName) {
      alert("Please enter item name, item count, and price.");
      return;
    }

    // Check if the edited Item ID already exists in the database but belongs to a different record
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
      // If `editItemId` differs from the original `recordId`, handle ID update
      if (editItemId !== recordId) {
        const { error: insertError } = await supabase.from("inventory").insert({
          id: editItemId,
          remarks: editRemarks,
          item_description: editDescription,
          brand: editBrand,
          model: editModel,
          serial: editSerial,
          major_category: editMajorCategory,
          minor_category: editMinorCategory,
          location: editLocation,
          product_name: editName,
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
        // If the ID remains the same, just update other fields
        const { error: updateError } = await supabase
          .from("inventory")
          .update({
            remarks: editRemarks,
            item_description: editDescription,
            brand: editBrand,
            model: editModel,
            serial: editSerial,
            major_category: editMajorCategory,
            minor_category: editMinorCategory,
            location: editLocation,
            product_name: editName,
            price: parseFloat(editPrice),
          })
          .eq("id", recordId);

        if (updateError) throw updateError;
      }

      // Refresh data and close the edit form
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
        <div className="flex items-center space-x-2">
          <InventorySearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            inventoryRecords={inventoryRecords}
          />
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Item
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-95 max-w-lg">
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
              type="text"
              value={newItemCount}
              onChange={(e) => setNewItemCount(e.target.value)}
              placeholder="Item Count"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="Price"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              value={newRemarks}
              onChange={(e) => setNewRemarks(e.target.value)}
              placeholder="Item Condition"
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
              type="text"
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
            {filteredRecords.map((record) => (
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
                      <button
                        onClick={() => {
                          handleAddStockClick(record.id);
                          toggleActionsMenu(record.id);
                        }}
                        className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Add Stock
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
      {showAddStockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded w-80 max-w-xs">
            <h2 className="text-xl font-bold mb-4">Add Stock</h2>
            <input
              type="text"
              value={additionalStock}
              onChange={(e) => setAdditionalStock(e.target.value)}
              placeholder="Stock Quantity"
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleAddStock}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddStockModal(false)}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
