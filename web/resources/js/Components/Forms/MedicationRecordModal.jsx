import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

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
  const [data, setData] = useState({
    patient_id: patient_id || "",
    medicine_id: "",
    dosage: "",
    reason: "",
    pdf_file: null,
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      setData({
        patient_id: selectedMedication?.patient_id || patient_id || "",
        medicine_id: selectedMedication?.medicine_id || "",
        dosage: selectedMedication?.dosage || "",
        reason: selectedMedication?.reason || "",
        pdf_file: null,
      });
    } else {
      setData({
        patient_id: patient_id || "",
        medicine_id: "",
        dosage: "",
        reason: "",
        pdf_file: null,
      });
    }
  }, [showModal, selectedMedication, patient_id]);

  const handleFileChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      pdf_file: e.target.files[0],
    }));
  };

  const handleClose = () => {
    toggleMedicationModal(false);
    if (onClose) onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const isUpdating = isEditing && selectedMedication;
    const url = route(
      isUpdating ? "medication.update" : "medication.create",
      isUpdating ? selectedMedication.id : null
    );

    const formData = new FormData();
    formData.append("patient_id", data.patient_id || "");
    formData.append("medicine_id", data.medicine_id || "");
    formData.append("dosage", data.dosage || "");
    formData.append("reason", data.reason || "");
    if (data.pdf_file) {
      formData.append("pdf_file", data.pdf_file);
    }

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toggleMedicationModal(false);
      toast.success(
        isUpdating ? "Medication Record updated successfully!" : "Medication Record added successfully!"
      );
    } catch (error) {
      if (error.response?.data?.errors) {
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
        <input type="hidden" value={data.patient_id} name="patient_id" />

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
              setData((prevState) => ({
                ...prevState,
                medicine_id: selected ? selected.id : "",
              }));
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
            onChange={(e) =>
              setData((prevState) => ({ ...prevState, dosage: e.target.value }))
            }
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
            onChange={(e) =>
              setData((prevState) => ({ ...prevState, reason: e.target.value }))
            }
            rows={4}
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Provide a reason (optional)"
          />
          {errors.reason && <InputError message={errors.reason} />}
        </div>

        {/* PDF File Field */}
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

export default MedicationRecordModal;