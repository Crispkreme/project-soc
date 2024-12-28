import React, { useEffect } from "react";
import { toast } from 'react-hot-toast';
import { useForm } from "@inertiajs/react";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const InventoryModal = ({ showModal, toggleInventoryModal, selectedInventory, medicines, isEditing, isViewing = false, onClose }) => {

  const { data, setData, post, processing, errors, reset } = useForm({
    medicine_id: "",
    sold: 0,
    in_stock: 0,
    description: "",
    expiration_date: "",
    dosage: "",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedInventory) {
        setData({
          medicine_id: selectedInventory.medicine_id || "",
          sold: selectedInventory.sold || 0,
          in_stock: selectedInventory.in_stock || 0,
          description: selectedInventory.description || "",
          expiration_date: selectedInventory.expiration_date || "",
          dosage: selectedInventory.dosage || "",
        });
      } else {
        reset();
      }
    }
  }, [showModal, selectedInventory]);

  const handleClose = () => {
    toggleInventoryModal(false);
    reset();
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "inventory.update" : "inventory.create",
      isEditing ? selectedInventory.id : null
    );

    post(url, {
      onSuccess: () => {
        toggleInventoryModal(false);
        toast.success("Inventory updated successfully!");
      },
      onError: () => {
        toast.error("An error occurred while saving inventory.");
      },
    });
  };

  const { medicine_id, sold, in_stock, description, expiration_date, dosage } = data;

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6">
        <div className="mt-4">
          <InputLabel value="Medicine" />
          <ComboBox
            items={medicines}
            value={medicines.find((medicine) => medicine.id === medicine_id)}
            onChange={(selected) => setData("medicine_id", selected ? selected.id : "")}
            placeholder="Select a Medicine"
            displayKey="name"
            disabled={isViewing}
          />
          {errors.medicine_id && <InputError message={errors.medicine_id} />}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 w-full">
          <div>
            <InputLabel value="Dispensed" />
            <TextInput
              value={sold}
              onChange={(e) => setData("sold", e.target.value)}
              type="number"
              className="w-full border p-2 rounded"
              disabled={true}
              placeholder="Medicine already dispensed"
            />
            {errors.sold && <InputError message={errors.sold} />}
          </div>
          <div>
            <InputLabel value="In Stock" />
            <TextInput
              value={in_stock}
              onChange={(e) => setData("in_stock", e.target.value)}
              type="number"
              className="w-full border p-2 rounded"
              disabled={isViewing}
              placeholder="Number of items in stock"
            />
            {errors.in_stock && <InputError message={errors.in_stock} />}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 w-full">
          <div>
            <InputLabel value="Expiration Date" />
            <TextInput
              value={expiration_date}
              onChange={(e) => setData("expiration_date", e.target.value)}
              type="date"
              className="w-full border p-2 rounded"
              disabled={isViewing}
            />
            {errors.expiration_date && <InputError message={errors.expiration_date} />}
          </div>
          <div>
            <InputLabel value="Dosage" />
            <TextInput
              value={dosage}
              onChange={(e) => setData("dosage", e.target.value)}
              type="text"
              className="w-full border p-2 rounded"
              disabled={isViewing}
              placeholder="Enter dosage"
            />
            {errors.dosage && <InputError message={errors.dosage} />}
          </div>
        </div>
        <div className="mt-4">
          <InputLabel htmlFor="description" value="Description" />
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the medicine"
            value={description}
            onChange={(e) => setData("description", e.target.value)}
            className="mt-1 block w-full"
            helperText="Medicine Description"
            disabled={isViewing}
          />
        </div>
        <div className="mt-4">
          {!isViewing && (
            <PrimaryButton type="submit" disabled={processing}>
              {isEditing ? "Update" : "Save"}
            </PrimaryButton>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default InventoryModal;