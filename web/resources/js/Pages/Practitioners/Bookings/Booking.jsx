import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const ConfirmDeleteModal = React.lazy(() => import("@/Components/Modals/ConfirmDeleteModal"));

const Booking = ({ appointments }) => {
    
    const [showModal, setShowModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMedicines, setFilteredMedicines] = useState(appointments);

    const toggleModal = () => setShowModal(!showModal);
    const closeModal = () => setShowModal(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        const filtered = appointments.filter(appointment =>
            appointment.doctor_name.toLowerCase().includes(query.toLowerCase()) ||
            appointment.patient_name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredMedicines(filtered);
    };

    const openViewModal = (medicine) => {
        setSelectedMedicine(medicine);
        setIsEditing(false);
        setIsViewing(true);
        setShowModal(true);
    };

    const openEditModal = (medicine) => {
        setSelectedMedicine(medicine);
        setIsEditing(true);
        setIsViewing(false);
        setShowModal(true);
    };

    const confirmDeleteHandler = () => {
        if (medicineToDelete) {
            Inertia.delete(route('admin.delete.medicines', medicineToDelete.id), {
                onSuccess: () => {
                    setConfirmDelete(false);
                    setMedicineToDelete(null);
                },
                onError: () => console.error("Error deleting medicine"),
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${period}`;
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientLayout>
                <Head title="Manage Appointments" />

                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium">Manage Appointments</h2>
                    </div>

                    <div className="pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="table-search"
                                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for appointments"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Doctor Name</th>
                                    <th className="px-6 py-3">Patient Name</th>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Appointment Date</th>
                                    <th className="px-6 py-3">Start Time</th>
                                    <th className="px-6 py-3">End Time</th>
                                    <th className="px-6 py-3">Slot</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.length > 0 ? (
                                    filteredMedicines.map((appointment, index) => (
                                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{appointment.doctor_name}</td>
                                            <td className="px-6 py-4">{appointment.patient_name}</td>
                                            <td className="px-6 py-4">{appointment.title}</td>
                                            <td className="px-6 py-4">{formatDate(appointment.appointment_date)}</td>
                                            <td className="px-6 py-4">{formatTime(appointment.appointment_start)}</td>
                                            <td className="px-6 py-4">{formatTime(appointment.appointment_end)}</td>
                                            <td className="px-6 py-4">{appointment.slot}</td>
                                            <td className="px-6 py-4">{appointment.appointment_status}</td>
                                            <td className="px-6 py-4">{formatDate(appointment.created_at)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center py-4 text-gray-500">
                                            No Appointments Available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ConfirmDeleteModal
                    isOpen={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={confirmDeleteHandler}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete "${medicineToDelete?.medicine_name}"?`}
                />
            </PatientLayout>
        </Suspense>
    );
};

export default Booking;