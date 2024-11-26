import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const StatusButton = React.lazy(() => import("@/Components/Buttons/StatusButton"));
const ApproveModal = React.lazy(() => import("@/Components/Forms/ApproveModal"));

const Appointment = ({ appointments }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const toggleModal = (appointment = null) => {
        setSelectedAppointment(appointment);
        setShowModal(!showModal);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAppointment(null);
    };

    function formatTimeToAMPM(time) {
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12;
        return `${adjustedHour}:${minute} ${ampm}`;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Appointments" />

                <div className='grid grid-cols-1 gap-6 mb-6'>
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Appointment</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                                <thead>
                                    <tr>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">ID</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Patient Name</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Appointment</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Notes</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Time</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length > 0 ? appointments.map((appointment, index) => (
                                        <tr key={`${appointment.id}-${appointment.patient_name}`}>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{index + 1}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <div className="flex items-center">
                                                    <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                                                    <a 
                                                        href="#" 
                                                        className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                                                    >
                                                        {appointment.patient_name}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{appointment.title}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{appointment.notes}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{appointment.appointment_date}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">
                                                    {formatTimeToAMPM(appointment.appointment_start)} - {formatTimeToAMPM(appointment.appointment_end)}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <StatusButton 
                                                    status={appointment.booking_status} 
                                                    onClick={() => toggleModal(appointment)}
                                                />
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-gray-500">No Account Available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showModal && selectedAppointment && (
                    <ApproveModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedAppointment={selectedAppointment}
                    />
                )}
            </AdminLayout>
        </Suspense>
    );
};

export default Appointment;
