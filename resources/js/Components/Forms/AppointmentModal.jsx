import React, { lazy } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from '@inertiajs/react';

const Modal = lazy(() => import("@/Components/Modals/Modal"));
const Title = lazy(() => import("@/Components/Headers/Title"));
const InputLabel = lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = lazy(() => import("@/Components/Inputs/TextInput"));
const InputError = lazy(() => import("@/Components/Inputs/InputError"));
const PrimaryButton = lazy(() => import("@/Components/Buttons/PrimaryButton"));
const ComboBox = lazy(() => import("@/Components/Inputs/ComboBox"));

const AppointmentModal = ({ showModal, toggleModal, doctors, barangayEvents }) => {
  const { data, setData, post, processing, errors } = useForm({
    barangay_event_id: '',
    notes: '',
    appointment_date: '',
    appointment_start: '',
    appointment_end: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('schedule.create'), {
      data,
      onSuccess: (response) => {
        toggleModal(false);
        toast.success("Account added successfully!");
      },
      onError: (errors) => {
        toggleModal(false);
        toast.error("An error occurred during account creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <form onSubmit={submit} className="p-6">
        <Title>Create Schedule</Title>

        <div className="mt-4">
          <InputLabel value="Barangay Event" />
          <ComboBox
            items={barangayEvents}
            value={barangayEvents.find((event) => event.id === data.barangay_event_id)}
            onChange={(selected) => setData("barangay_event_id", selected ? selected.id : "")}
            placeholder="Select a Barangay Event"
            displayKey="event_name"
          />
          {errors.barangay_event_id && <InputError message={errors.barangay_event_id} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Appointment Date" />
          <TextInput
            value={data.appointment_date}
            onChange={(e) => setData("appointment_date", e.target.value)}
            type="date"
            className="w-full border p-2 rounded"
          />
          {errors.appointment_date && <InputError message={errors.appointment_date} />}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel value="Appointment Start" />
            <TextInput
              value={data.appointment_start}
              onChange={(e) => setData("appointment_start", e.target.value)}
              type="time"
              className="w-full border p-2 rounded"
            />
            {errors.appointment_start && <InputError message={errors.appointment_start} />}
          </div>
          <div>
            <InputLabel value="Appointment End" />
            <TextInput
              value={data.appointment_end}
              onChange={(e) => setData("appointment_end", e.target.value)}
              type="time"
              className="w-full border p-2 rounded"
            />
            {errors.appointment_end && <InputError message={errors.appointment_end} />}
          </div>
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="notes" value="Notes" />
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add schedule notes..."
            value={data.notes}
            onChange={(e) => setData("notes", e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
          />
          {errors.notes && <InputError message={errors.notes} />}
        </div>

        <div className="mt-4 flex justify-center">
          <PrimaryButton disabled={processing} className="px-8 py-2">
            {processing ? 'Saving...' : 'Save Schedule'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
