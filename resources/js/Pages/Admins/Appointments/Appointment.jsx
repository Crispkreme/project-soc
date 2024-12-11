import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';
import CancelAppointmentModal from '../../../Components/Forms/CancelAppointmentModal';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const StatusButton = React.lazy(() => import("@/Components/Buttons/StatusButton"));
const ApproveModal = React.lazy(() => import("@/Components/Forms/ApproveModal"));
const Table = React.lazy(() => import("@/Components/Table"));

const Appointment = ({ appointments }) => {
    console.log("appointments", appointments);
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleModal = (appointment = null, type = "") => {
        setSelectedAppointment(appointment);
        setModalType(type);
        setShowModal(!showModal);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType("");
        setSelectedAppointment(null);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = appointments.filter((appointment) => {
            const patientName = appointment.patient_name?.toLowerCase() || "";
            return (
                appointment.title.toLowerCase().includes(query) ||
                patientName.includes(query)
            );
        });

        setFilteredAppointments(filtered);
    };

    const appointmentColumns = [
        { key: "patient_name", label: "Patient Name" },
        { key: "title", label: "Appointment" },
        { key: "appointment_date", label: "Event Date" },
        { key: "appointment_time", label: "Time" },
        { key: "reason", label: "Reason" },
        { key: "updated_at", label: "Updated" },
        { key: "actions", label: "Action" },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Appointments" />

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Appointments</div>
                            <input
                                type="text"
                                placeholder="Search appointments"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="border p-2 rounded text-sm w-64"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <Table
                                columns={appointmentColumns}
                                data={filteredAppointments.map((appointment) => ({
                                    patient_name: appointment.patient_name,
                                    title: appointment.title,
                                    appointment_date: appointment.appointment_date,
                                    appointment_time: `${appointment.appointment_start} - ${appointment.appointment_end}`,
                                    reason: appointment.reason,
                                    updated_at: appointment.updated_at,
                                    actions: [
                                        <StatusButton
                                            key="approve"
                                            status={appointment.booking_status}
                                            onClick={() => toggleModal(appointment, "Approve")}
                                        />,
                                        appointment.booking_status === 'Pending' && (
                                            <StatusButton
                                                key="cancel"
                                                status="Failed"
                                                onClick={() => toggleModal(appointment, "cancel")}
                                            />
                                        )
                                    ],
                                    
                                }))}
                                noDataMessage="No Appointments Available."
                            />
                        </div>
                    </div>
                </div>

                {showModal && modalType === "approve" && selectedAppointment && (
                    <ApproveModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedAppointment={selectedAppointment}
                    />
                )}

                {showModal && modalType === "cancel" && selectedAppointment && (
                    <CancelAppointmentModal
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
