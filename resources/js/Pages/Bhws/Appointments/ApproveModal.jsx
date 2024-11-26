import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const ApproveModal = ({ showModal, toggleModal, selectedAppointment }) => {
    
    const submit = async (e) => {
        e.preventDefault();
        
        try {
            await Inertia.post(route('admin.approve.appointments', { id: selectedAppointment?.id }));
            toggleModal();
        } catch (error) {
            console.error("Error submitting appointment approval:", error);
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
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Title" />
                            <TextInput
                                value={selectedAppointment?.title}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Date" />
                            <TextInput
                                value={formatDate(selectedAppointment?.appointment_date)}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Time" />
                            <TextInput
                                value={`${formatTimeToAMPM(selectedAppointment?.appointment_start)} - ${formatTimeToAMPM(selectedAppointment?.appointment_end)}`}
                                type="text"
                                className="w-full border p-2 rounded"
                                disabled={true}
                            />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                name="description"
                                rows={5}
                                placeholder="What the appointment description"
                                value={selectedAppointment?.notes}
                                className="mt-1 block w-full"
                                helperText="Tell us what this medicine is used for"
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                        <button 
                            type="button" 
                            onClick={submit} 
                            className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                        >
                            Approve
                        </button>
                    </span>
                    <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        <button 
                            type="button" 
                            onClick={toggleModal} 
                            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                        >
                            Cancel
                        </button>
                    </span>
                </div>
            </div>
        </Modal>
    );
};

export default ApproveModal;
