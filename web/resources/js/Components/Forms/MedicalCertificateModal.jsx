import React, { useEffect } from "react";
import { toast } from 'react-hot-toast';
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modals/Modal";
import Title from "@/Components/Headers/Title";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Textarea from "@/Components/Inputs/Textarea";
import TextInput from "@/Components/Inputs/TextInput";

const MedicalCertificateModal = ({
  showModal,
  toggleMedicalModal,
  selectedReferral = null,
}) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    patient_id: "",
    hospital_id: "",
    doctor_id: "",
    purpose: "", // Change from `reason` to `purpose`
    referral_status: "Inprogress",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedReferral) {
        // Only set data when selectedReferral changes
        setData({
          patient_id: selectedReferral.patient_id || "",
          hospital_id: selectedReferral.hospital_id || "",
          doctor_id: selectedReferral.doctor_id || "",
          purpose: selectedReferral.purpose || "", // Change from `reason` to `purpose`
          referral_status: selectedReferral.referral_status || "Inprogress",
        });
      } else {
        reset(); // Reset when there's no referral
      }
    }
  }, [showModal, selectedReferral]); // Depend on showModal and selectedReferral only

  const submit = (e) => {
    e.preventDefault();

    const url = selectedReferral
      ? route("medical.certificate.update", { id: selectedReferral.id })
      : route("medical.certificate.create");

    post(url, {
      onSuccess: () => {
        toggleMedicalModal(false);
        toast.success("Medical Certificate successfully saved!");
      },
      onError: () => {
        toast.error("An error occurred during Medical Certificate creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={() => toggleMedicalModal(false)}>
      <form onSubmit={submit} className="p-6">
        <Title>{selectedReferral ? "Medical Certificate" : "Medical Certificate"}</Title>
        
        {/* Patient Field */}
        <div className="mt-4">
          <InputLabel value="Patient" />
          <TextInput
            value={selectedReferral?.patient_name || "No patient selected"}
            type="text"
            className="w-full border p-2 rounded"
            disabled
          />
        </div>
        <div className="mt-4">
          <InputLabel value="Doctor" />
          <TextInput
            value={selectedReferral?.doctor_name || "No doctor selected"}
            type="text"
            className="w-full border p-2 rounded"
            disabled
          />
        </div>

        {/* Purpose Field */}
        <div className="mt-4">
          <InputLabel value="Purpose of Medical Certificate" />
          <Textarea
            value={data.purpose} // Change from `data.reason` to `data.purpose`
            onChange={(e) => setData("purpose", e.target.value)} // Update key to `purpose`
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Provide a purpose for the Medical Certificate"
          />
          {errors.purpose && <InputError message={errors.purpose} />} {/* Match with `purpose` */}
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <PrimaryButton type="submit" disabled={processing}>
            {selectedReferral ? "Create Medical Certificate" : "Create Medical Certificate"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default MedicalCertificateModal;
