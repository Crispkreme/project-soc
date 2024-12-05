import React, { useEffect } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modals/Modal";
import Title from "@/Components/Headers/Title";
import InputLabel from "@/Components/Inputs/InputLabel";
import DangerButton from "@/Components/Buttons/DangerButton";
import InputError from "@/Components/Inputs/InputError";
import { toast } from "react-hot-toast";

const CancelAppointmentModal = ({ showModal, toggleModal, selectedAppointment }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    patient_id: selectedAppointment?.patient_id || "",
    reason: "",
  });

  useEffect(() => {
    if (selectedAppointment) {
      setData({
        patient_id: selectedAppointment.patient_id || "",
        reason: "",
      });
    }
  }, [selectedAppointment]);

  const handleChange = (field, value) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    post(route("cancel.booking.appointment", { id: selectedAppointment?.id }), {
      onSuccess: () => {
        toggleModal(false);
        reset();
        toast.success("Appointment canceled successfully!");
      },
      onError: () => {
        toast.error("Failed to cancel the appointment. Please try again.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <div className="p-6">
        <Title>
          <TbUsersPlus className="mr-2" />
          Cancel Appointment
        </Title>

        <form onSubmit={submit}>
          <input type="hidden" name="patient_id" value={data.patient_id} />
          <div className="w-full mb-5">
            <InputLabel htmlFor="reason" value="Reason" />
            <textarea
              id="reason"
              name="reason"
              rows={5}
              placeholder="Reason for cancellation"
              value={data.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full"
            />
            <InputError message={errors.reason} />
          </div>
          <div className="mt-6 text-right">
            <DangerButton type="submit" disabled={processing}>
              {processing ? "Processing..." : "Cancel Appointment"}
            </DangerButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CancelAppointmentModal;
