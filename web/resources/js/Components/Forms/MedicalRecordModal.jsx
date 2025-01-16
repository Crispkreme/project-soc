import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));

const MedicalRecordModal = ({
  showModal,
  toggleMedicalRecordModal,
  selectedRecord,
  patient_id,
  medicines,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id || "",
    medicine_id: "",
    diagnosis: "",
    pdf_file: null,
  });

  const [pdfPreview, setPdfPreview] = useState(null);

  useEffect(() => {
    if (showModal) {
      if (selectedRecord) {
        setData({
          patient_id: selectedRecord.patient_id || patient_id || "",
          medicine_id: selectedRecord.medicine_id || "",
          diagnosis: selectedRecord.diagnosis || "",
          pdf_file: selectedRecord.pdf_file || null,
        });
        setPdfPreview(selectedRecord.pdf_file || null);
      } else {
        setData({
          patient_id: patient_id || "",
          medicine_id: "",
          diagnosis: "",
          pdf_file: null,
        });
        setPdfPreview(null);
      }
    }
  }, [showModal, selectedRecord, patient_id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData("pdf_file", file);
    setPdfPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    toggleMedicalRecordModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("patient_id", data.patient_id);
    formData.append("medicine_id", data.medicine_id);
    formData.append("diagnosis", data.diagnosis);
    
    if (data.pdf_file) {
      formData.append("pdf_file", data.pdf_file);
    }

    const url = route(
      isEditing ? "medical.record.update" : "medical.record.create",
      isEditing ? selectedRecord.id : null
    );
    console.log(url);
    post(url, {
      data: formData,
      onSuccess: (response) => {
        toggleMedicalRecordModal(false);
        toast.success("Medical Record added successfully!");
      },
      onError: (errors) => {
        toggleMedicalRecordModal(false);
        toast.error("An error occurred during medical creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <form onSubmit={submit} className="p-6" encType="multipart/form-data">
        <input
          type="hidden"
          value={data.patient_id}
          name="patient_id"
          onChange={(e) => setData("patient_id", e.target.value)}
        />
        <Title>
          {isViewing
            ? "View Medical Record"
            : isEditing
            ? "Edit Medical Record"
            : "Add Medical Record"}
        </Title>

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
            placeholder="Select a medicine"
            displayKey="medicine_name"
            ariaLabel="Select medicine"
            disabled={isViewing}
          />
          {errors.medicine_id && <InputError message={errors.medicine_id} />}
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
          {pdfPreview && (
            <div className="mt-2">
              <a
                href={pdfPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                View PDF
              </a>
            </div>
          )}
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

export default MedicalRecordModal;
