import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));

const MedicationRecordModal = ({
  showModal,
  toggleMedicationModal,
  selectedMedication,
  patient_id,
  medicines,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id || "",
    medicine_id: "",
    dosage: "",
    reason: "",
  });

  useEffect(() => {
    if (showModal) {
      setData({
        patient_id: selectedMedication?.patient_id || patient_id || "",
        medicine_id: selectedMedication?.medicine_id || "",
        dosage: selectedMedication?.dosage || "",
        reason: selectedMedication?.reason || "",
      });
    } else {
      setData({
        patient_id: patient_id || "",
        medicine_id: "",
        dosage: "",
        reason: "",
      });
    }
  }, [showModal, selectedMedication, patient_id]);
  

  const handleClose = () => {
    toggleMedicationModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "medication.update" : "medication.create",
      isEditing ? selectedMedication.id : null
    );

    post(url, {
      onSuccess: (response) => {
        toggleMedicationModal(false);
        toast.success("Medication Record added successfully!");
      },
      onError: (errors) => {
        toggleMedicationModal(false);
        toast.error("An error occurred during medication creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6">
        <input
          type="hidden"
          value={data.patient_id}
          name="patient_id"
          onChange={(e) => setData("patient_id", e.target.value)}
        />
        <Title>
          {isViewing
            ? "View Medication Record"
            : isEditing
            ? "Edit Medication Record"
            : "Add Medication Record"}
        </Title>

        {/* Medicine Field */}
        <div className="mt-4">
          <InputLabel value="Medicine" />
          <ComboBox
            items={medicines}
            value={data.medicine_id}
            onChange={(selected) => {
              setData("medicine_id", selected ? selected.id : ""); 
            }}
            placeholder="Select a Medicine"
            displayKey="medicine_name"
            disabled={isViewing}
          />

          {errors.medicine_id && <InputError message={errors.medicine_id} />}
        </div>

        {/* Dosage Field */}
        <div className="mt-4">
          <InputLabel value="Dosage" />
          <TextInput
            value={data.dosage}
            onChange={(e) => setData("dosage", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the dosage"
          />
          {errors.dosage && <InputError message={errors.dosage} />}
        </div>

        {/* Reason Field */}
        <div className="mt-4">
          <InputLabel value="Reason" />
          <Textarea
            value={data.reason}
            onChange={(e) => setData("reason", e.target.value)}
            rows={4}
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Reason for medication (optional)"
          />
          {errors.reason && <InputError message={errors.reason} />}
        </div>

        {/* Submit Button */}
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

export default MedicationRecordModal;
