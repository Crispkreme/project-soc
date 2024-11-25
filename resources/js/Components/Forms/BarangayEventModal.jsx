import React, { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));

const BarangayEventModal = ({
  showModal,
  toggleBarangayEventModal,
  doctors,
  bhws,
  isEditing,
  selectedBarangayEvent,
}) => {
  const { data, setData, post, processing, errors } = useForm({
    doctor_id: selectedBarangayEvent?.doctor_id || "",
    bhw_id: selectedBarangayEvent?.bhw_id || "",
    event_date: selectedBarangayEvent?.event_date || "",
    event_start: selectedBarangayEvent?.event_start || "",
    event_end: selectedBarangayEvent?.event_end || "",
    event_name: selectedBarangayEvent?.event_name || "",
    event_venue: selectedBarangayEvent?.event_venue || "",
  });

  // Use useRef to prevent unnecessary resetting on every render
  const hasDataBeenSet = useRef(false);

  useEffect(() => {
    // Only set data if not already set
    if (showModal && !hasDataBeenSet.current) {
      if (isEditing && selectedBarangayEvent) {
        setData({
          doctor_id: selectedBarangayEvent.doctor_id || "",
          bhw_id: selectedBarangayEvent.bhw_id || "",
          event_date: selectedBarangayEvent.event_date || "",
          event_start: selectedBarangayEvent.event_start || "",
          event_end: selectedBarangayEvent.event_end || "",
          event_name: selectedBarangayEvent.event_name || "",
          event_venue: selectedBarangayEvent.event_venue || "",
        });
      } else {
        // Reset form data for new event
        setData({
          doctor_id: "",
          bhw_id: "",
          event_date: "",
          event_start: "",
          event_end: "",
          event_name: "",
          event_venue: "",
        });
      }

      // Mark the data as set
      hasDataBeenSet.current = true;
    }

    // Reset the flag when modal is closed
    if (!showModal) {
      hasDataBeenSet.current = false;
    }
  }, [showModal, isEditing, selectedBarangayEvent, setData]);

  const handleClose = () => {
    toggleBarangayEventModal(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const url = route(
      isEditing ? "barangay.event.update" : "barangay.event.create",
      isEditing ? selectedBarangayEvent.id : null
    );

    post(url, {
      onSuccess: () => {
        handleClose();
      },
      onError: (errors) => {
        console.error("An error occurred", errors);
      },
    });
  };

  return (
    <Modal show={showModal} onClose={toggleBarangayEventModal}>
      <form onSubmit={submit} className="p-6">
        <Title>{isEditing ? "Edit Barangay Event" : "Create Barangay Event"}</Title>

        {/* Doctor Field */}
        <div className="mt-4">
          <InputLabel value="Doctor" />
          <ComboBox
            items={doctors}
            value={doctors.find((doctor) => doctor.id === data.doctor_id)}
            onChange={(selected) => setData("doctor_id", selected ? selected.id : "")}
            placeholder="Select a Doctor"
            displayKey="name"
          />
          {errors.doctor_id && <InputError message={errors.doctor_id} />}
        </div>

        {/* BHW Field */}
        <div className="mt-4">
          <InputLabel value="Bhw" />
          <ComboBox
            items={bhws}
            value={bhws.find((bhw) => bhw.id === data.bhw_id)}
            onChange={(selected) => setData("bhw_id", selected ? selected.id : "")}
            placeholder="Select a Bhw"
            displayKey="name"
          />
          {errors.bhw_id && <InputError message={errors.bhw_id} />}
        </div>

        {/* Barangay Event Name Field */}
        <div className="mt-4">
          <InputLabel value="Barangay Event Name" />
          <TextInput
            value={data.event_name}
            onChange={(e) => setData("event_name", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
          />
          {errors.event_name && <InputError message={errors.event_name} />}
        </div>

        {/* Appointment Date Field */}
        <div className="mt-4">
          <InputLabel value="Appointment Date" />
          <TextInput
            value={data.event_date}
            onChange={(e) => setData("event_date", e.target.value)}
            type="date"
            className="w-full border p-2 rounded"
          />
          {errors.event_date && <InputError message={errors.event_date} />}
        </div>

        {/* Appointment Time Fields */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel value="Appointment Start" />
            <TextInput
              value={data.event_start}
              onChange={(e) => setData("event_start", e.target.value)}
              type="time"
              className="w-full border p-2 rounded"
            />
            {errors.event_start && <InputError message={errors.event_start} />}
          </div>
          <div>
            <InputLabel value="Appointment End" />
            <TextInput
              value={data.event_end}
              onChange={(e) => setData("event_end", e.target.value)}
              type="time"
              className="w-full border p-2 rounded"
            />
            {errors.event_end && <InputError message={errors.event_end} />}
          </div>
        </div>

        {/* Notes Field (Event Venue) */}
        <div className="mt-4">
          <InputLabel htmlFor="event_venue" value="Notes (Event Venue)" />
          <textarea
            id="event_venue"
            name="event_venue"
            rows={4}
            placeholder="Barangay Event Venue"
            value={data.event_venue}
            onChange={(e) => setData("event_venue", e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
          />
          {errors.event_venue && <InputError message={errors.event_venue} />}
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex justify-center">
          <PrimaryButton disabled={processing} className="px-8 py-2">
            {processing ? "Saving..." : isEditing ? "Update Barangay Event" : "Save Barangay Event"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default BarangayEventModal;
