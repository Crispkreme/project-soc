import React, { lazy } from 'react';
import { useForm } from '@inertiajs/react';

const Modal = lazy(() => import("@/Components/Modals/Modal"));
const ComboBox = lazy(() => import("@/Components/Inputs/ComboBox"));
const Title = lazy(() => import("@/Components/Headers/Title"));
const InputLabel = lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = lazy(() => import("@/Components/Inputs/Textarea"));
const InputError = lazy(() => import("@/Components/Inputs/InputError"));
const PrimaryButton = lazy(() => import("@/Components/Buttons/PrimaryButton"));

const AppointmentModal = ({ showModal, toggleModal, doctors }) => {
  const { data, setData, post, processing, errors } = useForm({
    doctor_id: '', 
    patient_id: '', 
    title: '', 
    notes: '', 
    appointment_date: '', 
    appointment_start: '', 
    appointment_end: '', 
    approved_date: '', 
    booking_status: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('patient.create.booking'), {
      data,
      onSuccess: () => toggleModal(),
      onError: (errors) => console.error("An error occurred", errors),
    });
  };

  const handleDoctorChange = (selectedDoctor) => {
    setData('doctor_id', selectedDoctor.id);
  };

  const doctorName = doctors.map((doctor) => ({
    ...doctor,
    name: `${doctor.firstname} ${doctor.middlename ? doctor.middlename + ' ' : ''}${doctor.lastname}`
  }));

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <form onSubmit={submit} className="p-6">
        <Title>Book Appointment</Title>

        <div className="mt-4">
          <InputLabel value="Doctor" />
          <ComboBox
            items={doctorName}
            onChange={handleDoctorChange}
            placeholder="Select a Doctor"
            displayKey="name"
            ariaLabel="Select Doctor"
          />
        </div>

        <div className="mt-4">
          <InputLabel value="Appointment Title" />
          <TextInput
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
          />
          {errors.title && <InputError message={errors.title} />}
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
          <InputLabel htmlFor="notes" value="Medicine Name" />
          <Textarea
            id="notes"
            name="notes"
            rows={5}
            placeholder="What is the Medicine Description"
            value={data.notes}
            onChange={(e) => setData("notes", e.target.value)}
            className="mt-1 block w-full"
            helperText="Tell us the reason for the appointment"
          />
          {errors.notes && <InputError message={errors.notes} />}
        </div>

        <div className="mt-4">
          <PrimaryButton type="submit" disabled={processing}>
            Create Booking
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
