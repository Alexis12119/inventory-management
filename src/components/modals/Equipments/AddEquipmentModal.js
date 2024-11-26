import React, { useState } from "react";

const AddEquipmentModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [majorCategory, setMajorCategory] = useState("");
  const [minorCategory, setMinorCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [oum, setOum] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [daysInterval, setDaysInterval] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name,
      description,
      brand,
      model,
      serial,
      major_category: majorCategory,
      minor_category: minorCategory,
      quantity,
      oum,
      unit_cost: unitCost,
      location,
      condition,
      days_interval: daysInterval });
    onClose();
    setName("");
    setDescription("");
    setBrand("");
    setModel("");
    setSerial("");
    setMajorCategory("");
    setMinorCategory("");
    setQuantity("");
    setOum("");
    setUnitCost("");
    setLocation("");
    setCondition("");
    setDaysInterval("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>{" "}
      <div className="bg-white rounded shadow-lg p-8  relative w-96 max-w-full">
        {" "}
        <h2 className="text-xl font-bold mb-4">Add Equipment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Equipment Name"
            className="border rounded w-full p-3"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Serial"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={majorCategory}
            onChange={(e) => setMajorCategory(e.target.value)}
            placeholder="Major Category"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={minorCategory}
            onChange={(e) => setMinorCategory(e.target.value)}
            placeholder="Minor Category"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="border rounded w-full p-3"
            required
          />
          <input
            type="text"
            value={oum}
            onChange={(e) => setOum(e.target.value)}
            placeholder="OuM"
            className="border rounded w-full p-3"
            required
          />
          <input
            type="text"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            placeholder="Unit Cost"
            className="border rounded w-full p-3"
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Condition"
            className="border rounded w-full p-3"
          />
          <input
            type="text"
            value={daysInterval}
            onChange={(e) => setDaysInterval(e.target.value)}
            placeholder="Days Interval"
            className="border rounded w-full p-3"
            required
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black  rounded ml-4 py-2 px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentModal;
