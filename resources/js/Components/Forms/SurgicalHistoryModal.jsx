import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import axios from "axios";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const SurgicalHistoryModal = ({ showModal, toggleSurgicalModal, selectedSurgicalRecord, patient_id, isEditing, doctors, onClose }) => {
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const [data, setData] = useState({
    patient_id: patient_id,
    procedure: "",
    description: "",
    doctor_id: selectedSurgicalRecord ? selectedSurgicalRecord.doctor_id : "",
    pdf_file: null,
  });

  useEffect(() => {
    if (showModal) {
      if (selectedSurgicalRecord) {
        setData({
          patient_id: patient_id,
          procedure: selectedSurgicalRecord.procedure || "",
          description: selectedSurgicalRecord.description || "",
          doctor_id: selectedSurgicalRecord.doctor_id,
          pdf_file: null,
        });
      } else {
        setData({
          patient_id: patient_id,
          procedure: "",
          description: "",
          doctor_id: "",
          pdf_file: null,
        });
      }
    }
  }, [showModal, selectedSurgicalRecord, patient_id]);

  const handleFileChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      pdf_file: e.target.files[0],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    const isUpdating = isEditing && selectedSurgicalRecord;

    const url = isUpdating
      ? route("surgical.record.update", { id: selectedSurgicalRecord.id })
      : route("surgical.record.create");

    const formData = new FormData();
    formData.append("patient_id", data.patient_id || "");
    formData.append("procedure", data.procedure || "");
    formData.append("description", data.description || "");
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

      toggleSurgicalModal(false);
      toast.success(
        isUpdating
          ? "Surgical Record updated successfully!"
          : "Surgical Record added successfully!"
      );
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("An error occurred while processing the request.");
      }
    }
  };

  const doctorChange = (selectedDoctor) => {
    setData((prevState) => ({
      ...prevState,
      doctor_id: selectedDoctor.value,
    }));
  };

  return (
    <Modal show={showModal} onClose={() => { 
      toggleSurgicalModal(false); 
      if (onClose) onClose();
    }}>
      <form onSubmit={submit} className="p-6">
        <input 
          type="hidden" 
          value={patient_id} 
          name="patient_id" 
          onChange={(e) => setData((prevState) => ({ ...prevState, patient_id: e.target.value }))}
        />
        <Title>
          {isEditing ? "Edit Surgical Record" : "Add Surgical Record"}
        </Title>

        <div className="mt-4">
          <InputLabel value="Procedure" />
          <TextInput
            value={data.procedure}
            onChange={(e) => setData((prevState) => ({ ...prevState, procedure: e.target.value }))}
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter the procedure"
          />
          {errors.procedure && <InputError message={errors.procedure} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Description" />
          <Textarea
            value={data.description}
            onChange={(e) => setData((prevState) => ({ ...prevState, description: e.target.value }))}
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Provide a description (optional)"
          />
          {errors.description && <InputError message={errors.description} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Select Doctor" />
          <ComboBox
            items={doctors}
            value={data.doctor_id}
            onChange={doctorChange}
            placeholder="Select a doctor"
            displayKey="option"
            ariaLabel="Select doctor"
            getOptionLabel={(option) => `${option.firstname} ${option.middlename} ${option.lastname}`} 
          />
          {errors.doctor_id && <InputError message={errors.doctor_id} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Upload PDF File (optional)" />
          <input
            type="file"
            name="pdf_file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {errors.pdf_file && <InputError message={errors.pdf_file} />}
        </div>

        <div className="mt-4">
          <PrimaryButton type="submit" disabled={processing}>
            {isEditing ? "Update" : "Save"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default SurgicalHistoryModal;