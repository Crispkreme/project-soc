import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

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
  const { data, setData, post, processing, reset, errors } = useForm({
    patient_id: "",
    name: "",
    result: "",
  });

  // Populate the form only when the modal opens or the selectedTestResult changes
  useEffect(() => {
    if (showModal) {
      if (selectedTestResult) {
        setData({
          patient_id: selectedTestResult.patient_id || patient_id || "",
          name: selectedTestResult.name || "",
          result: selectedTestResult.result || "",
        });
      } else {
        reset({
          patient_id: patient_id || "",
          name: "",
          result: "",
        });
      }
    }
  }, [showModal, selectedTestResult]);

  const handleClose = () => {
    toggleTestResultModal(false);
    if (onClose) onClose();
  };

  const submit = (e) => {
    e.preventDefault();

    const url = route(
      isEditing ? "test.result.update" : "test.result.create",
      isEditing ? selectedTestResult?.id : null
    );

    post(url, {
      onSuccess: (response) => {
        toggleTestResultModal(false);
        toast.success("Test Result added successfully!");
      },
      onError: (errors) => {
        toggleTestResultModal(false);
        toast.error("An error occurred during Test Result creation.");
      },
    });
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
            onChange={(e) => setData("name", e.target.value)}
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
            onChange={(e) => setData("result", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
            disabled={isViewing}
            placeholder="Enter the test result"
          />
          {errors.result && <InputError message={errors.result} />}
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
