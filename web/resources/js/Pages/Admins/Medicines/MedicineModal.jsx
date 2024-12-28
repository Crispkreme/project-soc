import React, { useEffect } from "react";
import { useForm } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import { LuClipboardEdit } from "react-icons/lu";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const MedicineModal = ({ showModal, toggleModal, selectedMedicine, isEditing, isViewing }) => {
  
  const { data, setData, post, processing, errors, reset } = useForm({
    medicine_name: '',
    description: '',
  });

  const submit = (e) => {
    e.preventDefault();

    const isUpdating = isEditing && selectedMedicine;

    setData((prevData) => ({
      ...prevData,
      id: selectedMedicine?.id ?? undefined, 
    }));

    const url = route(isUpdating ? "admin.update.medicines" : "admin.store.medicines", isUpdating ? selectedMedicine.id : null);
      post(url, {
        data: {
          ...data,
        },
        onSuccess: () => {
          toggleModal();
        },
        onError: () => {
        },
    });
  };

  useEffect(() => {
    if (showModal) {
      if (selectedMedicine) {
        setData((prevData) => ({
          ...prevData,
          medicine_name: selectedMedicine.medicine_name || "",
          description: selectedMedicine.description || "",
          id: selectedMedicine.id,
        }));
      } else {
        setData({
          medicine_name: "",
          description: "",
          id: undefined,
        });
      }
    }
  }, [showModal, selectedMedicine]);

  const handleClose = () => {
    toggleModal();
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <div className="p-6">

        <Title>
          {isViewing ? (
            "View Medicine"
          ) : isEditing ? (
            "Update Medicine"
          ) : (
            "Add New Medicine"
          )}
        </Title>

        <form onSubmit={submit}>
          <div className="mt-8">
            <InputLabel htmlFor="medicine_name" value="Medicine Name" />
            <TextInput
              id="medicine_name"
              type="text"
              name="medicine_name"
              value={data.medicine_name}
              className="mt-1 block w-full"
              autoComplete="username"
              isFocused={!isViewing}
              onChange={(e) => setData("medicine_name", e.target.value)}
              disabled={isViewing}
            />
            <InputError message={errors.medicine_name} className="mt-2" />
          </div>
          <div className="mt-4">
            <InputLabel htmlFor="description" value="Medicine Description" />
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder="What is the Medicine Description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="mt-1 block w-full"
              helperText="Tell us what this medicine use for"
              disabled={isViewing}
            />
            <InputError message={errors.medicine_name} className="mt-2" />
          </div>
          <div className="mt-4 flex items-center justify-end">
            {isViewing ? (
              <PrimaryButton className="ms-4" onClick={handleClose}>
                <CgClose className="mr-1" /> Close
              </PrimaryButton>
            ) : isEditing ? (
              <PrimaryButton className="ms-4" disabled={processing}>
                <LuClipboardEdit className="mr-1" /> Update
              </PrimaryButton>
            ) : (
              <PrimaryButton className="ms-4" disabled={processing}>
                <HiOutlinePlusSm className="mr-1" /> Medicine
              </PrimaryButton>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MedicineModal;
