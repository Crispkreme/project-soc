import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Table = React.lazy(() => import("@/Components/Table"));

const AppointmentRecord = ({ appointments }) => {
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);
    const [searchQuery, setSearchQuery] = useState("");

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
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Appointments" />

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Appointments Report</div>
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
                                }))}
                                noDataMessage="No Appointments Available."
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
};

export default AppointmentRecord;
