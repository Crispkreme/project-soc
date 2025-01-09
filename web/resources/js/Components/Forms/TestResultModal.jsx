import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const TestResultModal = ({
  showModal,
  toggleTestResultModal,
  selectedTestResult,
  patient_id,
  isEditing,
  isViewing = false,
  onClose,
}) => {
  const [data, setData] = useState({
    patient_id: "",
    name: "",
    result: "",
    pdf_file: null,
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (showModal) {
      if (selectedTestResult) {
        setData({
          patient_id: selectedTestResult.patient_id || patient_id || "",
          name: selectedTestResult.name || "",
          result: selectedTestResult.result || "",
          pdf_file: null,
        });
      } else {
        setData({
          patient_id: patient_id || "",
          name: "",
          result: "",
          pdf_file: null,
        });
      }
    }
  }, [showModal, selectedTestResult, patient_id]);

  const handleFileChange = (e) => {
    setData((prevState) => ({
      ...prevState,
      pdf_file: e.target.files[0],
    }));
  };

  const handleClose = () => {
    toggleTestResultModal(false);
    if (onClose) onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const isUpdating = isEditing && selectedTestResult;
    const url = route(
      isUpdating ? "test.result.update" : "test.result.create",
      isUpdating ? selectedTestResult?.id : null
    );

    const formData = new FormData();
    formData.append("patient_id", data.patient_id || "");
    formData.append("name", data.name || "");
    formData.append("result", data.result || "");
    if (data.pdf_file) {
      formData.append("pdf_file", data.pdf_file);
    }

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toggleTestResultModal(false);
      toast.success(
        isUpdating
          ? "Test Result updated successfully!"
          : "Test Result added successfully!"
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
          onChange={(e) => setData((prevState) => ({ ...prevState, patient_id: e.target.value }))}
        />
        <Title>
          {isViewing
            ? "View Test Result"
            : isEditing
            ? "Edit Test Result"
            : "Add Test Result"}
        </Title>

        {/* Name Field (Test Name) */}
        <div className="mt-4">
          <InputLabel value="Test Name" />
          <TextInput
            value={data.name}
            onChange={(e) => setData((prevState) => ({ ...prevState, name: e.target.value }))}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the test name"
          />
          {errors.name && <InputError message={errors.name} />}
        </div>

        {/* Result Field (Test Result) */}
        <div className="mt-4">
          <InputLabel value="Test Result" />
          <TextInput
            value={data.result}
            onChange={(e) => setData((prevState) => ({ ...prevState, result: e.target.value }))}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the test result"
          />
          {errors.result && <InputError message={errors.result} />}
        </div>

        {/* PDF Upload Field */}
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

export default TestResultModal;
