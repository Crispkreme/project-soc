import React from 'react';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const AppointmentModal = ({ showModal, toggleModal, selectedAppointment }) => {

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="p-4">
                
                {selectedAppointment ? (

                    <form action="" className="p-6">
                        <Title>Schedule Appointment</Title>
                    
                        <div className="mt-4">
                            <InputLabel value="Doctor" />
                            <TextInput
                                value={selectedAppointment.doctor_name}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled={true}
                            />
                        </div>
                    
                        <div className="mt-4">
                            <InputLabel value="Patient" />
                            <TextInput
                                value={selectedAppointment.patient_name}
                                type="text"
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    
                        <div className="mt-4">
                            <InputLabel value="Appointment" />
                            <TextInput
                                value={selectedAppointment.title}
                                type="text"
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <InputLabel value="Appointment Date" />
                                <TextInput
                                    value={selectedAppointment.date}
                                    type="date"
                                    className="w-full border p-2 rounded"
                                    disabled={true}
                                />
                            </div>
                    
                            <div>
                                <InputLabel value="Appointment Time (Start)" />
                                <TextInput
                                    value={selectedAppointment.extendedProps?.formattedStart}
                                    type="time"
                                    className="w-full border p-2 rounded"
                                    disabled={true}
                                />
                            </div>
                    
                            <div>
                                <InputLabel value="Appointment Time (End)" />
                                <TextInput
                                    value={selectedAppointment.extendedProps?.formattedEnd}
                                    type="time"
                                    className="w-full border p-2 rounded"
                                    disabled={true}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="usage" value="Description" />
                            <Textarea
                                id="usage"
                                name="usage"
                                rows={4}
                                placeholder="What is the Medicine Usage"
                                value={selectedAppointment.notes}
                                className="mt-1 block w-full"
                                helperText="Appointment Description"
                                disabled={true}
                            />
                        </div>
                    </form>
                
                ) : (
                    <p>No appointment selected.</p>
                )}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={toggleModal}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AppointmentModal