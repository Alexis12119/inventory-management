import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this record?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onDelete}
            className="bg-red-500 text-white py-2 px-4 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
