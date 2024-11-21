import React, { lazy } from 'react';
import { useForm } from '@inertiajs/react';

const Modal = lazy(() => import("@/Components/Modals/Modal"));
const ComboBox = lazy(() => import("@/Components/Inputs/ComboBox"));
const Title = lazy(() => import("@/Components/Headers/Title"));
const InputLabel = lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = lazy(() => import("@/Components/Inputs/TextInput"));
const InputError = lazy(() => import("@/Components/Inputs/InputError"));
const GenericButton = lazy(() => import("@/Components/Buttons/GenericButton"));

const AppointmentModal = ({ showModal, toggleModal, doctor }) => {
  const { data, setData, post, processing, errors } = useForm({
    consultation_type: '', 
    patient_id: '', 
    details: '', 
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

  const consultationChange = (consultation) => {
    setData('consultation_type', consultation.consultation);
  };

  const consultation = [
    {consultation: 'General Consultation'},
    {consultation: 'Diagnosis and Assessment'},
    {consultation: 'Treatment and Planning'},
    {consultation: 'Preventive Care'}
  ]

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <form onSubmit={submit} className="p-6">
        <Title>Add Schedule</Title>

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

        <div className="mt-4">
          <InputLabel value="Consultation" />
          <ComboBox
            items={consultation}
            onChange={consultationChange}
            placeholder="Type of Consultation"
            displayKey="consultation"
            ariaLabel="Select consultation"
          />
        </div>

        <div className="mt-4">
          <InputLabel value="Details" />
          <TextInput
            value={data.details}
            onChange={(e) => setData("details", e.target.value)}
            type="text"
            className="w-full border p-2 rounded"
          />
          {errors.details && <InputError message={errors.details} />}
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
        <div className='flex flex-col justify-center py-8 items-center'>
          {/* Need to change to doctor's name */}
          <img src={"/assets/image/signature.png"} height={10} width={100}/>
          <h1>{doctor.username}</h1>
        </div>
        <div className="mt-4 flex justify-center">
          <GenericButton
            disabled={processing}
            className="px-8 py-2"
          >
            Set
          </GenericButton>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
