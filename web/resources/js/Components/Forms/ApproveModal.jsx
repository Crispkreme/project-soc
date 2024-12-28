import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Inertia } from '@inertiajs/inertia';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const ApproveModal = ({ showModal, toggleModal, selectedAppointment }) => {

    const [description, setDescription] = useState(selectedAppointment?.notes || '');
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            await Inertia.post(
                route('approve.appointments', { id: selectedAppointment?.id }),
                { description }
            );
            toggleModal(false);
            toast.success("Booking Successfully Accepted!");
        } catch (error) {
            toggleModal(false);
            toast.error("Error submitting appointment approval");
        } finally {
            setProcessing(false);
        }
    };

    function formatTimeToAMPM(time) {
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12;
        return `${adjustedHour}:${minute} ${ampm}`;
    }

    const formatDate = (date) => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="p-4">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Title>Appointment Information</Title>
                    <div className="mt-2">
                        <div className="mt-4">
                            <InputLabel value="Name" />
                            <TextInput
                                value={selectedAppointment?.patient_name}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Title" />
                            <TextInput
                                value={selectedAppointment?.title}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Date" />
                            <TextInput
                                value={formatDate(selectedAppointment?.appointment_date)}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Time" />
                            <TextInput
                                value={`${formatTimeToAMPM(selectedAppointment?.appointment_start)} - ${formatTimeToAMPM(selectedAppointment?.appointment_end)}`}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                name="description"
                                rows={5}
                                placeholder="Enter the appointment description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full border rounded"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <PrimaryButton onClick={submit} className="ml-4" disabled={processing}>
                        {processing ? 'Processing...' : 'Approve'}
                    </PrimaryButton>
                    <button
                        type="button"
                        onClick={toggleModal}
                        className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ApproveModal;
