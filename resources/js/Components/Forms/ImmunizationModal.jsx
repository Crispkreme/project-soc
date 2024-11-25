import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));

const ImmunizationModal = ({
  showModal,
  toggleImmunizationModal,
  selectedImmunization,
  patient_id,
  doctors,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id || "",
    immunization: "",
    doctor_id: selectedImmunization ? selectedImmunization.doctor_id : "",
  });

  useEffect(() => {

    if (showModal) {
      if (selectedImmunization) {
        setData({
          doctor_id: selectedImmunization.doctor_id,
          patient_id: selectedImmunization.patient_id || patient_id || "",
          immunization: selectedImmunization.immunization || "",
        });
      } else {
        setData({
          doctor_id: "",
          patient_id: patient_id || "",
          immunization: "",
        });
      }
    }
  }, [showModal, selectedImmunization, patient_id]);

  const handleClose = () => {
    toggleImmunizationModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "immunization.update" : "immunization.create",
      isEditing ? selectedImmunization?.id : null
    );

    post(url, {
      onSuccess: () => {
        handleClose();
      },
      onError: (errors) => {
        console.error("An error occurred", errors);
      },
    });
  };

  const doctorChange = (selectedDoctor) => {
    setData("doctor_id", selectedDoctor?.value || selectedDoctor?.id);
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
            ? "View Immunization Record"
            : isEditing
            ? "Edit Immunization Record"
            : "Add Immunization Record"}
        </Title>

        {/* Immunization Field */}
        <div className="mt-4">
          <InputLabel value="Immunization" />
          <TextInput
            value={data.immunization}
            onChange={(e) => setData("immunization", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the immunization name"
          />
          {errors.immunization && <InputError message={errors.immunization} />}
        </div>

        {/* Doctor Field */}
        <div className="mt-4">
          <InputLabel value="Doctor" />
          <ComboBox
            items={doctors}
            value={data.doctor_id}
            onChange={(selected) => {
              setData("doctor_id", selected ? selected.id : ""); 
            }}
            placeholder="Select a doctor"
            displayKey="doctor_name"
            ariaLabel="Select doctor"
          />
          {errors.doctor_id && <InputError message={errors.doctor_id} />}
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

export default ImmunizationModal;
