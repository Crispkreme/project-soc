import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const HealthHistoryModal = ({
  showModal,
  toggleModal,
  selectedHealthRecord,
  patient_id,
  patients,
  isEditing,
  isViewing,
}) => {
  console.log(patient_id);
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id,
    name: "",
    description: "",
  });

  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (showModal) {
      if (selectedHealthRecord) {
        setData({
          patient_id: patient_id,
          name: selectedHealthRecord.name || "",
          description: selectedHealthRecord.description || "",
        });

        const patient = patients.find(
          (p) => p.id === patient_id
        );
        setSelectedPatient(patient || null);
      } else {
        setData({
          patient_id: patient_id,
          name: "",
          description: "",
        });
        setSelectedPatient(null);
      }
    }
  }, [showModal, selectedHealthRecord, patients]);

  const submit = (e) => {
    e.preventDefault();

    const isUpdating = isEditing && selectedHealthRecord;
    const url = route(
      isUpdating ? "health.record.update" : "health.record.create",
      isUpdating ? selectedHealthRecord.id : null
    );

    post(url, {
      onSuccess: () => {
        toggleModal(null, false, false);
      },
      onError: (errors) => {
        console.error("An error occurred", errors);
      },
    });
  };

  return (
    <Modal show={showModal} onClose={() => toggleModal(null, false, false)}>
      <form onSubmit={submit} className="p-6">
        <input type="hidden" value={data.patient_id} name="patient_id" onChange={(e) => setData("patient_id", e.target.value)}/>
        <Title>
          {isViewing
            ? "View Health Record"
            : isEditing
            ? "Edit Health Record"
            : "Add Health Record"}
        </Title>

        <div className="mt-4">
          <InputLabel value="Health Record Name" />
          <TextInput
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the name of the health record"
          />
          {errors.name && <InputError message={errors.name} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Description" />
          <Textarea
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            rows={5}
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Provide a description (optional)"
          />
          {errors.description && <InputError message={errors.description} />}
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

export default HealthHistoryModal;
