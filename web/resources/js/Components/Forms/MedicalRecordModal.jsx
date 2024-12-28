import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
// const SelectInput = React.lazy(() => import("@/Components/Inputs/SelectInput"));

const MedicalRecordModal = ({
  showModal,
  toggleMedicalRecordModal,
  selectedRecord,
  patient_id,
  medicines,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id || "",
    medicine_id: "",
    diagnosis: "",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedRecord) {
        setData({
          patient_id: selectedRecord.patient_id || patient_id || "",
          medicine_id: selectedRecord.medicine_id || "",
          diagnosis: selectedRecord.diagnosis || "",
        });
      } else {
        setData({
          patient_id: patient_id || "",
          medicine_id: "",
          diagnosis: "",
        });
      }
    }
  }, [showModal, selectedRecord, patient_id]);

  const handleClose = () => {
    toggleMedicalRecordModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "medical.record.update" : "medical.record.create",
      isEditing ? selectedRecord.id : null
    );

    post(url, {
      onSuccess: (response) => {
        toggleMedicalRecordModal(false);
        toast.success("Medical Record added successfully!");
      },
      onError: (errors) => {
        toggleMedicalRecordModal(false);
        toast.error("An error occurred during medical creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6">
        {/* Hidden Patient ID */}
        <input
          type="hidden"
          value={data.patient_id}
          name="patient_id"
          onChange={(e) => setData("patient_id", e.target.value)}
        />
        <Title>
          {isViewing
            ? "View Medical Record"
            : isEditing
            ? "Edit Medical Record"
            : "Add Medical Record"}
        </Title>

        {/* Diagnosis Field */}
        <div className="mt-4">
          <InputLabel value="Diagnosis" />
          <TextInput
            value={data.diagnosis}
            onChange={(e) => setData("diagnosis", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the diagnosis"
          />
          {errors.diagnosis && <InputError message={errors.diagnosis} />}
        </div>

        {/* Medicine Field */}
        <div className="mt-4">
          <InputLabel value="Medicine" />
          {/* <SelectInput
            value={data.medicine_id}
            onChange={(e) => setData("medicine_id", e.target.value)}
            disabled={isViewing}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Medicine</option>
            {medicines.map((medicine) => (
              <option key={medicine.id} value={medicine.id}>
                {medicine.name}
              </option>
            ))}
          </SelectInput> */}
          {errors.medicine_id && <InputError message={errors.medicine_id} />}
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

export default MedicalRecordModal;
