import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const FamilyMedicalRecordModal = ({
  showModal,
  toggleFamilyMedicalModal,
  selectedFamily,
  patient_id,
  patients,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [selectedFamilyMedical, setSelectedFamilyMedical] = useState(null);
  const [data, setData] = useState({
    patient_id: patient_id || "",
    disease: "",
    relationship_disease: "",
    pdf_file: null,
  });

  useEffect(() => {
    if (showModal) {
      if (selectedFamily) {
        setData({
          patient_id: selectedFamily.patient_id || patient_id || "",
          disease: selectedFamily.disease || "",
          relationship_disease: selectedFamily.relationship_disease || "",
          pdf_file: null,
        });

        const patient = patients.find((p) => p.id === patient_id);
        setSelectedFamilyMedical(patient || null);
      } else {
        setData({
          patient_id: patient_id || "",
          disease: "",
          relationship_disease: "",
          pdf_file: null,
        });
        setSelectedFamilyMedical(null);
      }
    }
  }, [showModal, selectedFamily, patient_id]);

  const handleFileChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      pdf_file: e.target.files[0],
    }));
  };

  const handleClose = () => {
    toggleFamilyMedicalModal(false);
    if (onClose) onClose();
  };

  const submit = async (e) => {
    e.preventDefault();

    const isUpdating = isEditing && selectedFamily;
    const url = route(
      isUpdating ? "family.medical.update" : "family.medical.create",
      isUpdating ? selectedFamily.id : null
    );

    const formData = new FormData();
    formData.append("patient_id", data.patient_id || "");
    formData.append("disease", data.disease || "");
    formData.append("relationship_disease", data.relationship_disease || "");
    if (data.pdf_file) {
      formData.append("pdf_file", data.pdf_file);
    }

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toggleFamilyMedicalModal(false);
      toast.success(
        isUpdating
          ? "Family Medical Record updated successfully!"
          : "Family Medical Record added successfully!"
      );
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("An error occurred while processing the request.");
      }
    }
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6">
        <input
          type="hidden"
          value={data.patient_id}
          name="patient_id"
          onChange={(e) =>
            setData((prevState) => ({
              ...prevState,
              patient_id: e.target.value,
            }))
          }
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
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                disease: e.target.value,
              }))
            }
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
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                relationship_disease: e.target.value,
              }))
            }
            className="w-full border p-2 rounded"
            disabled={isViewing}
          >
            <option value="">Select relationship</option>
            <option value="Mother Family Disease">Mother Family Disease</option>
            <option value="Father Family Disease">Father Family Disease</option>
          </select>
          {errors.relationship_disease && (
            <InputError message={errors.relationship_disease} />
          )}
        </div>

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
