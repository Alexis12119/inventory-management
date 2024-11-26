import React, { useState, useEffect } from "react";

const EditEquipmentModal = ({ isOpen, onClose, onEdit, equipment }) => {
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
  const [days_interval, setDaysInterval] = useState("");

  useEffect(() => {
    if (equipment) {
      setName(equipment.name || "");
      setDescription(equipment.description || "");
      setBrand(equipment.brand || "");
      setModel(equipment.model || "");
      setSerial(equipment.serial || "");
      setMajorCategory(equipment.major_category || "");
      setMinorCategory(equipment.minor_category || "");
      setQuantity(equipment.quantity || "");
      setOum(equipment.oum || "");
      setUnitCost(equipment.unit_cost || "");
      setLocation(equipment.location || "");
      setCondition(equipment.condition || "");
      setDaysInterval(equipment.days_interval || "");
    }
  }, [equipment]);

  const handleEdit = async () => {
    if (
      !name &&
      !description &&
      !brand &&
      !model &&
      !serial &&
      !majorCategory &&
      !minorCategory &&
      !quantity &&
      !oum &&
      !unitCost &&
      !location &&
      !condition &&
      !days_interval
    ) {
      alert("Please fill out all fields.");
      return;
    }

    await onEdit({
      id: equipment.id,
      name,
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
      days_interval,
    });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded w-96 max-w-full">
        <h2 className="text-xl font-bold mb-2">Edit Equipment</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Equipment Name"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Serial"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={majorCategory}
          onChange={(e) => setMajorCategory(e.target.value)}
          placeholder="Major Category"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={minorCategory}
          onChange={(e) => setMinorCategory(e.target.value)}
          placeholder="Minor Category"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={oum}
          onChange={(e) => setOum(e.target.value)}
          placeholder="OuM"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={unitCost}
          onChange={(e) => setUnitCost(e.target.value)}
          placeholder="Unit Cost"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="Condition"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={days_interval}
          onChange={(e) => setDaysInterval(e.target.value)}
          placeholder="Days Interval"
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleEdit}
          className="text-white py-2 px-4 rounded bg-yellow-500"
        >
          Save
        </button>
        <button onClick={onClose} className="ml-4 py-2 px-4 rounded border">
          Cancel
        </button>
      </div>
    </div>
  ) : null;
};

export default EditEquipmentModal;
