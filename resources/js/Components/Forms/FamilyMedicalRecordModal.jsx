import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const FamilyMedicalRecordModal = ({
  showModal,
  toggleFamilyMedicalModal,
  selectedRecord,
  patient_id,
  patients,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id || "",
    disease: "",
    relationship_disease: "",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedRecord) {
        setData({
          patient_id: selectedRecord.patient_id || patient_id || "",
          disease: selectedRecord.disease || "",
          relationship_disease: selectedRecord.relationship_disease || "",
        });
      } else {
        setData({
          patient_id: patient_id || "",
          disease: "",
          relationship_disease: "",
        });
      }
    }
  }, [showModal, selectedRecord, patient_id]);

  const handleClose = () => {
    toggleFamilyMedicalModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "family.medical.update" : "family.medical.create",
      isEditing ? selectedRecord.id : null
    );

    post(url, {
      onSuccess: (response) => {
        toggleModal(false);
        toast.success("Family Medicine added successfully!");
      },
      onError: (errors) => {
        toggleModal(false);
        toast.error("An error occurred during family medicine creation.");
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
            ? "View Family Medical Record"
            : isEditing
            ? "Edit Family Medical Record"
            : "Add Family Medical Record"}
        </Title>

        {/* Disease Field */}
        <div className="mt-4">
          <InputLabel value="Disease" />
          <TextInput
            value={data.disease}
            onChange={(e) => setData("disease", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the disease"
          />
          {errors.disease && <InputError message={errors.disease} />}
        </div>

        {/* Relationship Disease Field */}
        <div className="mt-4">
          <InputLabel value="Relationship Disease" />
          <select
            value={data.relationship_disease}
            onChange={(e) => setData("relationship_disease", e.target.value)}
            className="w-full border p-2 rounded"
            disabled={isViewing}
          >
            <option value="">Select relationship</option>
            <option value="Mother Family Disease">Mother Family Disease</option>
            <option value="Father Family Disease">Father Family Disease</option>
          </select>
          {errors.relationship_disease && <InputError message={errors.relationship_disease} />}
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

export default FamilyMedicalRecordModal;
