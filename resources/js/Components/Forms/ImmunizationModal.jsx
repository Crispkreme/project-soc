import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from 'axios';

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
  const [data, setData] = useState({
    patient_id: patient_id || "",
    immunization: "",
    doctor_id: "",
    pdf_file: null,
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      setData({
        patient_id: selectedImmunization?.patient_id || patient_id || "",
        immunization: selectedImmunization?.immunization || "",
        doctor_id: selectedImmunization?.doctor_id || "",
        pdf_file: null,
      });
    } else {
      setData({
        patient_id: patient_id || "",
        immunization: "",
        doctor_id: "",
        pdf_file: null,
      });
    }
  }, [showModal, selectedImmunization, patient_id]);

  const handleFileChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      pdf_file: e.target.files[0],
    }));
  };

  const handleClose = () => {
    toggleImmunizationModal(false);
    if (onClose) onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const isUpdating = isEditing && selectedImmunization;
    const url = route(
      isUpdating ? "immunization.update" : "immunization.create",
      isUpdating ? selectedImmunization.id : null
    );

    const formData = new FormData();
    formData.append("patient_id", data.patient_id || "");
    formData.append("immunization", data.immunization || "");
    formData.append("doctor_id", data.doctor_id || "");
    if (data.pdf_file) {
      formData.append("pdf_file", data.pdf_file);
    }

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toggleImmunizationModal(false);
      toast.success(
        isUpdating
          ? "Immunization updated successfully!"
          : "Immunization added successfully!"
      );
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("An error occurred while processing the request.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6">
        {/* Hidden Patient ID */}
        <input
          type="hidden"
          value={data.patient_id}
          name="patient_id"
          readOnly
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
            onChange={(e) =>
              setData((prevState) => ({ ...prevState, immunization: e.target.value }))
            }
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
              setData((prevState) => ({
                ...prevState,
                doctor_id: selected ? selected.id : "",
              }));
            }}
            placeholder="Select a doctor"
            displayKey="name"
            ariaLabel="Select doctor"
            disabled={isViewing}
          />
          {errors.doctor_id && <InputError message={errors.doctor_id} />}
        </div>

        {/* File Upload Field */}
        <div className="mt-4">
          <InputLabel value="Upload PDF File (optional)" />
          <input
            type="file"
            name="pdf_file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            disabled={isViewing}
          />
          {errors.pdf_file && <InputError message={errors.pdf_file} />}
        </div>

        {/* Submit Button */}
        {!isViewing && (
          <div className="mt-4">
            <PrimaryButton type="submit" disabled={processing}>
              {isEditing ? "Update" : "Save"}
            </PrimaryButton>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ImmunizationModal;
