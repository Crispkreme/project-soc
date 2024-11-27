import React, { useEffect } from "react";
import { toast } from 'react-hot-toast';
import { useForm } from "@inertiajs/react";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const ReferralModal = ({
  showModal,
  toggleReferralModal,
  selectedReferral,
  patients,
  doctors,
  hospitals,
}) => {
  console.log("Modal State:", {
    showModal,
    selectedReferral,
    patients,
    doctors,
    hospitals,
  });

  const { data, setData, post, processing, errors, reset } = useForm({
    patient_id: "",
    hospital_id: "",
    refer_to_id: "",
    reason: "",
    referral_status: "Inprogress",
  });

  useEffect(() => {
    if (showModal) {
      if (selectedReferral) {
        setData({
          patient_id: selectedReferral.patient_id || "",
          hospital_id: selectedReferral.hospital_id || "",
          refer_to_id: selectedReferral.refer_to_id || "",
          reason: selectedReferral.reason || "",
          referral_status: selectedReferral.referral_status || "Inprogress",
        });
      } else {
        reset();
      }
    } else {
      reset();
    }
  }, [showModal, selectedReferral]);

  const submit = (e) => {
    e.preventDefault();

    const url = selectedReferral
      ? route("referrals.update", { id: selectedReferral.id })
      : route("referrals.create");

    post(url, {
      onSuccess: (response) => {
        toggleReferralModal(false);
        toast.success("Referral added successfully!");
      },
      onError: (errors) => {
        toggleReferralModal(false);
        toast.error("An error occurred during Referral creation.");
      },
    });
  };

  return (
    <Modal
      show={showModal}
      onClose={() => toggleReferralModal(null, false)}
    >
      <form onSubmit={submit} className="p-6">
        <Title>{selectedReferral ? "Edit Referral" : "Add Referral"}</Title>
        
        {/* Patient Field */}
        <div className="mt-4">
          <InputLabel value="Patient" />
          <TextInput
            value={selectedReferral.patient_name}
            type="text"
            className="w-full border p-2 rounded"
            disabled
            placeholder="Select a Patient"
          />
        </div>

        {/* Hospital Field */}
        <div className="mt-4">
          <InputLabel value="Referred Hospital" />
          <ComboBox
            items={hospitals}
            value={hospitals.find((hospital) => hospital.id === data.hospital_id)}
            onChange={(selected) =>
              setData("hospital_id", selected ? selected.id : "")
            }
            placeholder="Select a Hospital"
            displayKey="name"
          />
          {errors.hospital_id && <InputError message={errors.hospital_id} />}
        </div>

        {/* Doctor Field */}
        <div className="mt-4">
          <InputLabel value="Refer To (Doctor)" />
          <ComboBox
            items={doctors}
            value={doctors.find((doctor) => doctor.id === data.refer_to_id)}
            onChange={(selected) =>
              setData("refer_to_id", selected ? selected.id : "")
            }
            placeholder="Select a Doctor"
            displayKey="name"
          />
          {errors.refer_to_id && <InputError message={errors.refer_to_id} />}
        </div>

        {/* Reason Field */}
        <div className="mt-4">
          <InputLabel value="Reason for Referral" />
          <Textarea
            value={data.reason}
            onChange={(e) => setData("reason", e.target.value)}
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Provide a reason for the referral"
          />
          {errors.reason && <InputError message={errors.reason} />}
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <PrimaryButton type="submit" disabled={processing}>
            Create Referral
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default ReferralModal;
