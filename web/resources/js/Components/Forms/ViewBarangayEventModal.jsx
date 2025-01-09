import React from "react";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));

const ViewBarangayEventModal = ({
  showModal,
  toggleViewBarangayEventModal,
  selectedBarangayEvent,
}) => {
  const data = {
    doctor_id: selectedBarangayEvent?.doctor_name || "",
    bhw_id: selectedBarangayEvent?.bhw_name || "",
    event_date: selectedBarangayEvent?.event_date || "",
    event_start: selectedBarangayEvent?.event_start || "",
    event_end: selectedBarangayEvent?.event_end || "",
    event_name: selectedBarangayEvent?.event_name || "",
    event_venue: selectedBarangayEvent?.event_venue || "",
  };

  const handleClose = () => {
    toggleViewBarangayEventModal();
  };

  return (
    <Modal show={showModal} onClose={handleClose}>
      <div className="p-6">
        <Title>View Barangay Event</Title>
        <div className="mt-4">
          <InputLabel value="Doctor" />
          <TextInput
            value={data.doctor_id}
            type="text"
            className="w-full"
            disabled
          />
        </div>
        <div className="mt-4">
          <InputLabel value="Bhw" />
          <TextInput
            value={data.bhw_id}
            type="text"
            className="w-full"
            disabled
          />
        </div>
        <div className="mt-4">
          <InputLabel value="Barangay Event Name" />
          <TextInput
            value={data.event_name}
            type="text"
            className="w-full"
            disabled
          />
        </div>
        <div className="mt-4">
          <InputLabel value="Appointment Date" />
          <TextInput
            value={data.event_date}
            type="text"
            className="w-full"
            disabled
          />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel value="Start Time" />
            <TextInput
              value={data.event_start}
              type="text"
              className="w-full"
              disabled
            />
          </div>
          <div>
            <InputLabel value="End Time" />
            <TextInput
              value={data.event_end}
              type="text"
              className="w-full"
              disabled
            />
          </div>
        </div>
        <div className="mt-4">
          <InputLabel htmlFor="event_venue" value="Notes (Event Venue)" />
          <TextInput
            id="event_venue"
            name="event_venue"
            value={data.event_venue}
            type="text"
            className="w-full"
            disabled
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewBarangayEventModal;
