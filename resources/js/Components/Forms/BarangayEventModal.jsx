import React, { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";

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

  const hasDataBeenSet = useRef(false);

  useEffect(() => {
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
      hasDataBeenSet.current = true;
    }

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
      onSuccess: (response) => {
        const flash = response.props?.flash;
        if (flash?.error) {
          toggleBarangayEventModal(false);
          toast.error(flash.error);
        }

        if (flash?.success) {
          toggleBarangayEventModal(false);
          toast.success(flash.success);
        }
      },
      onError: (errors) => {
        console.error('Failed to book appointment:', errors);
      },
    });
  };

  const timeSchedule = [
    { value: "08:00", label: "08:00 AM" },
    { value: "09:00", label: "09:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "13:00", label: "01:00 PM" },
    { value: "14:00", label: "02:00 PM" },
    { value: "15:00", label: "03:00 PM" },
    { value: "16:00", label: "04:00 PM" },
    { value: "17:00", label: "05:00 PM" },
  ];

  return (
    <Modal show={showModal} onClose={toggleBarangayEventModal}>
      <form onSubmit={submit} className="p-6">
        <Title>{isEditing ? "Edit Barangay Event" : "Create Barangay Event"}</Title>
        <div className="mt-4">
          <InputLabel value="Doctor" />
          <ComboBox
            items={doctors}
            value={doctors.find((doctor) => doctor.id === data.doctor_id)}
            onChange={(selected) => setData("doctor_id", selected ? selected.id : "")}
            placeholder="Select a Doctor"
            displayKey="name"
          />
          <InputError message={errors.doctor_id} />
        </div>
        <div className="mt-4">
          <InputLabel value="Bhw" />
          <ComboBox
            items={bhws}
            value={bhws.find((bhw) => bhw.id === data.bhw_id)}
            onChange={(selected) => setData("bhw_id", selected ? selected.id : "")}
            placeholder="Select a Bhw"
            displayKey="name"
          />
          <InputError message={errors.bhw_id} />
        </div>
        <div className="mt-4">
          <InputLabel value="Barangay Event Name" />
          <TextInput
            value={data.event_name}
            onChange={(e) => setData("event_name", e.target.value)}
            type="text"
            className="w-full"
          />
          <InputError message={errors.event_name} />
        </div>
        <div className="mt-4">
          <InputLabel value="Appointment Date" />
          <TextInput
            value={data.event_date}
            onChange={(e) => setData("event_date", e.target.value)}
            type="date"
            className="w-full"
          />
          <InputError message={errors.event_date} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel value="Start Time" />
            <ComboBox
              items={timeSchedule}
              value={timeSchedule.find((time) => time.value === data.event_start)}
              onChange={(selected) => setData("event_start", selected ? selected.value : "")}
              placeholder="Select Start Time"
              displayKey="label"
            />
            <InputError message={errors.event_start} />
          </div>
          <div>
            <InputLabel value="End Time" />
            <ComboBox
              items={timeSchedule}
              value={timeSchedule.find((time) => time.value === data.event_end)}
              onChange={(selected) => setData("event_end", selected ? selected.value : "")}
              placeholder="Select End Time"
              displayKey="label"
            />
            <InputError message={errors.event_end} />
          </div>
        </div>
        <div className="mt-4">
          <InputLabel htmlFor="event_venue" value="Notes (Event Venue)" />
          <Textarea
            id="event_venue"
            name="event_venue"
            rows={4}
            placeholder="Enter event venue notes"
            value={data.event_venue}
            onChange={(e) => setData("event_venue", e.target.value)}
          />
          <InputError message={errors.event_venue} />
        </div>
        <div className="mt-4 flex justify-center">
          <PrimaryButton disabled={processing}>
            {processing ? "Saving..." : isEditing ? "Update Event" : "Save Event"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default BarangayEventModal;
