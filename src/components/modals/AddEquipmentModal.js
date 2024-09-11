import React from 'react';
import GenericModal from '../modals/GenericModal';
import { supabase } from '../auth/supabaseClient.js';

const AddEquipmentModal = ({ isOpen, onClose }) => {
  const handleAdd = async (data) => {
    await supabase.from("equipments").insert(data);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleAdd}
      title="Add Equipment"
      namePlaceholder="Equipment Name"
      pricePlaceholder="Price"
      nameKey="name"
      priceKey="price"
      isProduct={false}
    />
  );
};

export default AddEquipmentModal;
