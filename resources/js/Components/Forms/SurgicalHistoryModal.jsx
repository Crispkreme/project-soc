import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const SurgicalHistoryModal = ({
  showModal,
  toggleSurgicalModal,
  selectedSurgicalRecord,
  patient_id,
  isEditing,
  doctors,
  onClose,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: patient_id,
    procedure: "",
    description: "",
    doctor_id: selectedSurgicalRecord ? selectedSurgicalRecord.doctor_id : "",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedSurgicalRecord) {
        setData({
          patient_id: patient_id,
          procedure: selectedSurgicalRecord.procedure || "",
          description: selectedSurgicalRecord.description || "",
          doctor_id: selectedSurgicalRecord.doctor_id,
        });
      } else {
        setData({
          patient_id: patient_id,
          procedure: "",
          description: "",
          doctor_id: "",
        });
      }
    }
  }, [showModal, selectedSurgicalRecord, patient_id]);

  const submit = (e) => {
    e.preventDefault();

    const isUpdating = isEditing && selectedSurgicalRecord;
    const SurgicalId = selectedSurgicalRecord.id;

    const url = isUpdating 
    ? route("surgical.record.update", { id: SurgicalId }) 
    : route("surgical.record.create");

    post(url, {
      onSuccess: (response) => {
        toggleSurgicalModal(false);
        toast.success("Surgical added successfully!");
      },
      onError: (errors) => {
        toggleSurgicalModal(false);
        toast.error("An error occurred during Surgical creation.");
      },
    });
  };

  const doctorChange = (selectedDoctor) => {
    setData('doctor_id', selectedDoctor.value);
  };

  return (
    <Modal show={showModal} onClose={() => { 
      toggleSurgicalModal(null, false, false); 
      if (onClose) onClose();
    }}>
      <form onSubmit={submit} className="p-6">
        <input 
          type="hidden" 
          value={patient_id} 
          name="patient_id" 
          onChange={(e) => setData("patient_id", e.target.value)}
        />
        <Title>
          {isEditing ? "Edit Surgical Record" : "Add Surgical Record"}
        </Title>

        <div className="mt-4">
          <InputLabel value="Procedure" />
          <TextInput
            value={data.procedure}
            onChange={(e) => setData("procedure", e.target.value)}
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
            onChange={(e) => setData("description", e.target.value)}
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
          <PrimaryButton type="submit" disabled={processing}>
            {isEditing ? "Update" : "Save"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default SurgicalHistoryModal;
