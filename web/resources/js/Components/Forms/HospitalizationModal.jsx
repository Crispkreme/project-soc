import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import axios from "axios";

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

  const { data, setData, post, processing, errors, clearErrors, setErrors } = useForm({
    hospital_id: "",
    doctor_id: "",
    patient_id: patient_id || "",
    diagnosis: "",
    pdf_file: null,
  });

  useEffect(() => {
    if (showModal) {
      clearErrors();
      setData({
        hospital_id: selectedHospitalization?.hospital_id || "",
        doctor_id: selectedHospitalization?.doctor_id || "",
        patient_id: selectedHospitalization?.patient_id || patient_id || "",
        diagnosis: selectedHospitalization?.diagnosis || "",
        pdf_file: null,
      });
    }
  }, [showModal, selectedHospitalization, patient_id]);

  const handleClose = () => {
    toggleHospitalizationModal(false);
    if (onClose) onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData("pdf_file", file);
  };

  const submit = async (e) => {
    
    e.preventDefault();
    const isUpdating = isEditing && selectedHospitalization;
    const url = route(
      isUpdating ? "hospitalization.update" : "hospitalization.create",
      isUpdating ? selectedHospitalization.id : null
    );

    const formData = new FormData();
    formData.append("hospital_id", data.hospital_id || "");
    formData.append("doctor_id", data.doctor_id || "");
    formData.append("patient_id", data.patient_id || "");
    formData.append("diagnosis", data.diagnosis || "");

    if (data.pdf_file) {
      formData.append("pdf_file", data.pdf_file);
    }

    try {
      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toggleHospitalizationModal(false);
      toast.success(
        isUpdating
          ? "Hospitalization Record updated successfully!"
          : "Hospitalization Record added successfully!"
      );
    } catch (error) {
      if (error.response?.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6 space-y-4">
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

        <div>
          <InputLabel value="Diagnosis" />
          <TextInput
            value={data.diagnosis}
            onChange={(e) => setData("diagnosis", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the diagnosis"
          />
          <InputError message={errors.diagnosis} />
        </div>

        <div>
          <InputLabel value="Hospital" />
          <ComboBox
            items={hospitals}
            value={hospitals.find((hospital) => hospital.id === data.hospital_id)}
            onChange={(selected) => setData("hospital_id", selected?.id || "")}
            placeholder="Select a Hospital"
            displayKey="name"
            disabled={isViewing}
          />
          <InputError message={errors.hospital_id} />
        </div>

        <div>
          <InputLabel value="Doctor" />
          <ComboBox
            items={doctors}
            value={doctors.find((doctor) => doctor.id === data.doctor_id)}
            onChange={(selected) => setData("doctor_id", selected?.id || "")}
            placeholder="Select a Doctor"
            displayKey="name"
            disabled={isViewing}
          />
          <InputError message={errors.doctor_id} />
        </div>

        <div>
          <InputLabel value="Upload PDF File (optional)" />
          <input
            type="file"
            name="pdf_file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            disabled={isViewing}
          />
          <InputError message={errors.pdf_file} />
        </div>

        {!isViewing && (
          <PrimaryButton type="submit" disabled={processing}>
            {isEditing ? "Update" : "Save"}
          </PrimaryButton>
        )}
      </form>
    </Modal>
  );
};

export default HospitalizationModal;
