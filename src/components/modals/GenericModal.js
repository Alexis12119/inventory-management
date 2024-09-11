import React, { useState, useEffect } from 'react';

const GenericModal = ({
  isOpen,
  onClose,
  item,
  onSave,
  title,
  namePlaceholder,
  pricePlaceholder,
  nameKey,
  priceKey,
  isProduct,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (item) {
      setName(item[nameKey] || "");
      setPrice(item[priceKey] || "");
    }
  }, [item, nameKey, priceKey]);

  const handleSave = async () => {
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) {
      alert("Name should contain only letters and spaces.");
      return;
    }

    if (isProduct) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        alert("Price should be a valid positive number (integer or float).");
        return;
      }
    }

    if (!name || (isProduct && !price)) {
      alert("Please fill out all fields.");
      return;
    }

    await onSave({
      [nameKey]: name,
      ...(isProduct && { [priceKey]: parseFloat(price) }), 
    });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded w-80 max-w-xs">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
          className="border p-2 mb-4 w-full"
        />
        {isProduct && (
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={pricePlaceholder}
            className="border p-2 mb-4 w-full"
          />
        )}
        <button
          onClick={handleSave}
          className={`text-white py-2 px-4 rounded ${
            title.includes("Add") ? "bg-blue-500" : "bg-yellow-500"
          }`}
        >
          {title.includes("Add") ? "Add" : "Save"}
        </button>
        <button onClick={onClose} className="ml-4 py-2 px-4 rounded border">
          Cancel
        </button>
      </div>
    </div>
  ) : null;
};

export default GenericModal;
