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

const InventoryModal = ({
  showModal,
  toggleInventoryModal,
  selectedInventory,
  medicines,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    medicine_id: selectedInventory?.medicine_id || "",
    sold: selectedInventory?.sold || 0,
    in_stock: selectedInventory?.in_stock || 0,
    description: selectedInventory?.description || "",  // Add description to form state
  });

  // Update form data whenever the modal opens or selectedInventory changes
  useEffect(() => {
    if (showModal && selectedInventory) {
      setData({
        medicine_id: selectedInventory.medicine_id || "",
        sold: selectedInventory.sold || 0,
        in_stock: selectedInventory.in_stock || 0,
        description: selectedInventory.description || "",  // Set description here as well
      });
    } else {
      setData({
        medicine_id: "",
        sold: 0,
        in_stock: 0,
        description: "",  // Reset description if no selectedInventory
      });
    }
  }, [showModal, selectedInventory]);

  const handleClose = () => {
    toggleInventoryModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "inventory.update" : "inventory.create",
      isEditing ? selectedInventory.id : null
    );

    post(url, {
      onSuccess: (response) => {
        toggleInventoryModal(false);
        toast.success("Inventory added successfully!");
      },
      onError: (errors) => {
        toggleInventoryModal(false);
        toast.error("An error occurred during inventory creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6">
        <div className="mt-4">
          <InputLabel value="Medicine" />
          <ComboBox
            items={medicines}
            value={medicines.find((medicine) => medicine.id === data.medicine_id)}
            onChange={(selected) => setData("medicine_id", selected ? selected.id : "")}
            placeholder="Select a Medicine"
            displayKey="name"
            disabled={isViewing}
          />
          {errors.medicine_id && <InputError message={errors.medicine_id} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Dispense" />
          <TextInput
            value={data.sold}
            onChange={(e) => setData("sold", e.target.value)}
            type="number"
            className="w-full border p-2 rounded"
            disabled={true}
            placeholder="Medicine that are already dispensed"
          />
          {errors.sold && <InputError message={errors.sold} />}
        </div>

        <div className="mt-4">
          <InputLabel value="In Stock" />
          <TextInput
            value={data.in_stock}
            onChange={(e) => setData("in_stock", e.target.value)}
            type="number"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the number of items in stock"
          />
          {errors.in_stock && <InputError message={errors.in_stock} />}
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="usage" value="Description" />
          <Textarea
            id="usage"
            name="usage"
            rows={4}
            placeholder="What is the Medicine Usage"
            value={data.description}  // Bind to the form state
            onChange={(e) => setData("description", e.target.value)}  // Handle change
            className="mt-1 block w-full"
            helperText="Medicine Description"
            disabled={isViewing}  // Disable if viewing
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
