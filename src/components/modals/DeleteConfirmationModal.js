import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) =>
  isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this item?</p>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white py-2 px-4 rounded mt-4"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="ml-4 py-2 px-4 rounded border mt-4"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : null;

export default DeleteConfirmationModal;
