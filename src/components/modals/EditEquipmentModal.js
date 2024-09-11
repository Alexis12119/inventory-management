import React from 'react';
import GenericModal from '../modals/GenericModal';
import { supabase } from '../auth/supabaseClient.js';

const EditEquipmentModal = ({ isOpen, onClose, item }) => {
  const handleEdit = async (data) => {
    const { name } = data;

    const { error } = await supabase
      .from("equipments")
      .update(data)
      .match({ id: item.id });

    if (error) {
      alert("Error updating equipment: " + error.message);
      return;
    }

    const { error: maintenanceError } = await supabase
      .from("maintenance")
      .update({ equipment_name: name })
      .match({ equipment_id: item.id });

    if (maintenanceError) {
      alert("Error updating maintenance records: " + maintenanceError.message);
    }

    onClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleEdit}
      title="Edit Equipment"
      namePlaceholder="Equipment Name"
      pricePlaceholder="Price"
      nameKey="name"
      priceKey="price"
      item={item}
      isProduct={false}
    />
  );
};

export default EditEquipmentModal;
