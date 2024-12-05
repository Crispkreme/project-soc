import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));

const HospitalizationModal = ({
  showModal,
  toggleHospitalizationModal,
  selectedHospitalization,
  patient_id,
  hospitals,
  doctors,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    hospital_id: "",
    doctor_id: "",
    patient_id: patient_id || "",
    diagnosis: "",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedHospitalization) {
        setData({
          hospital_id: selectedHospitalization.hospital_id || "",
          doctor_id: selectedHospitalization.doctor_id || "",
          patient_id: selectedHospitalization.patient_id || patient_id || "",
          diagnosis: selectedHospitalization.diagnosis || "",
        });
      } else {
        setData({
          hospital_id: "",
          doctor_id: "",
          patient_id: patient_id || "",
          diagnosis: "",
        });
      }
    }
  }, [showModal, selectedHospitalization, patient_id]);

  const handleClose = () => {
    toggleHospitalizationModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "hospitalization.update" : "hospitalization.create",
      isEditing ? selectedHospitalization.id : null
    );

    post(url, {
      onSuccess: (response) => {
        toggleHospitalizationModal(false);
        toast.success("Hospitalization added successfully!");
      },
      onError: (errors) => {
        toggleHospitalizationModal(false);
        toast.error("An error occurred during hospitalization creation.");
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
            ? "View Hospitalization Record"
            : isEditing
            ? "Edit Hospitalization Record"
            : "Add Hospitalization Record"}
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

        <div className="mt-4">
          <InputLabel value="Hospital" />
          <ComboBox
            items={hospitals}
            value={hospitals.find(hospital => hospital.id === data.hospital_id)}
            onChange={(selected) => setData("hospital_id", selected ? selected.id : "")}
            placeholder="Select a Hospital"
            displayKey="name"
            disabled={isViewing}
          />
          {errors.hospital_id && <InputError message={errors.hospital_id} />}
        </div>

        {/* Doctor Field */}
        <div className="mt-4">
          <InputLabel value="Doctor" />
          <ComboBox
            items={doctors}
            value={doctors.find(doctor => doctor.id === data.doctor_id)}
            onChange={(selected) => setData("doctor_id", selected ? selected.id : "")}
            placeholder="Select a Doctor"
            displayKey="doctor_name"
            disabled={isViewing}
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

export default HospitalizationModal;
