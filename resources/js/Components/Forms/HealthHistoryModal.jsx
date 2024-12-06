import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const HealthHistoryModal = ({ showModal, toggleHealthModal, selectedHealthRecord, patient_id, patients, isEditing, isViewing, onClose }) => {

  const [data, setData] = useState({
    patient_id: patient_id,
    name: "",
    description: "",
    pdf_file: null,
  });
  
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (showModal) {
      if (selectedHealthRecord) {
        setData({
          patient_id: patient_id,
          name: selectedHealthRecord.name || "",
          description: selectedHealthRecord.description || "",
          pdf_file: null,
        });

        const patient = patients.find((p) => p.id === patient_id);
        setSelectedPatient(patient || null);
      } else {
        setData({
          patient_id: patient_id,
          name: "",
          description: "",
          pdf_file: null,
        });
        setSelectedPatient(null);
      }
    }
  }, [showModal, selectedHealthRecord, patients]);

  const handleFileChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      pdf_file: e.target.files[0],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const isUpdating = isEditing && selectedMedication;
    const url = route(
      isUpdating ? "health.record.update" : "health.record.create",
      isUpdating ? selectedMedication.id : null
    );

    const formData = new FormData();
    formData.append("patient_id", data.patient_id || "");
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
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
      toast.success(isUpdating ? "Medication Record updated successfully!" : "Medication Record added successfully!");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        console.log(error.response);
        setErrors(error.response.data.errors);
      } else {
        toast.error("An error occurred while processing the request.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onClose={() => {
        toggleHealthModal(null, false, false);
        if (onClose) onClose();
      }}
    >
      <form onSubmit={submit} className="p-6" encType="multipart/form-data">
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
            ? "View Health Record"
            : isEditing
            ? "Edit Health Record"
            : "Add Health Record"}
        </Title>

        <div className="mt-4">
          <InputLabel value="Health Record Name" />
          <TextInput
            value={data.name}
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
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
            onChange={(e) =>
              setData((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            rows={5}
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Provide a description (optional)"
          />
          {errors.description && <InputError message={errors.description} />}
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
