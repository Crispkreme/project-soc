import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";
import { PiEyeBold } from "react-icons/pi";

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const MedicalCertificateModal = React.lazy(() => import("@/Components/Forms/MedicalCertificateModal"));
const ConfirmDeleteModal = React.lazy(() => import("@/Components/Modals/ConfirmDeleteModal"));

const MedicalCertificate = ({ medicalCertificates }) => {
    
    console.log("medicalCertificates", medicalCertificates);

    const [showModal, setShowModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCertificates, setFilteredCertificates] = useState(medicalCertificates);

    const toggleModal = () => setShowModal(!showModal);
    const closeModal = () => setShowModal(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = medicalCertificates.filter(certificate =>
            certificate.purpose?.toLowerCase().includes(query.toLowerCase()) ||
            certificate.patient_name?.toLowerCase().includes(query.toLowerCase()) ||
            certificate.doctor_name?.toLowerCase().includes(query.toLowerCase()) ||
            certificate.issue_date?.toLowerCase().includes(query.toLowerCase()) ||
            certificate.examin_date?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredCertificates(filtered);
    };

    const openViewModal = (certificate) => {
        setSelectedCertificate(certificate);
        setIsEditing(false);
        setIsViewing(true);
        setShowModal(true);
    };

    const openEditModal = (certificate) => {
        setSelectedCertificate(certificate);
        setIsEditing(true);
        setIsViewing(false);
        setShowModal(true);
    };

    const confirmDeleteHandler = () => {
        if (certificateToDelete) {
            Inertia.delete(route('admin.delete.medical_certificates', certificateToDelete.id), {
                onSuccess: () => {
                    setConfirmDelete(false);
                    setCertificateToDelete(null);
                },
                onError: () => console.error("Error deleting medical certificate"),
            });
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientLayout>
                <Head title="Manage Medical Certificates" />

                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium">Manage Medical Certificates</h2>
                        <button
                            type="button"
                            className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                            onClick={toggleModal}
                        >
                            <HiOutlinePlusSm className="mr-1" /> Add Certificate
                        </button>
                    </div>

                    <div className="pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="table-search"
                                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for certificates"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Patient Name</th>
                                    <th className="px-6 py-3">Doctor Name</th>
                                    <th className="px-6 py-3">Purpose</th>
                                    <th className="px-6 py-3">Examin Date</th>
                                    <th className="px-6 py-3">Issue Date</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCertificates.length > 0 ? (
                                    filteredCertificates.map((certificate) => (
                                        <tr key={certificate.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{certificate.purpose}</td>
                                            <td className="px-6 py-4">{certificate.patient_name}</td>
                                            <td className="px-6 py-4">{certificate.doctor_name}</td>
                                            <td className="px-6 py-4">{certificate.examin_date}</td>
                                            <td className="px-6 py-4">{certificate.issue_date}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="bg-yellow-50 text-yellow-400 hover:text-yellow-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => openViewModal(certificate)}
                                                >
                                                    <PiEyeBold className="mr-1 text-sm" /> View
                                                </button>
                                                <button
                                                    className="bg-blue-50 text-blue-400 hover:text-blue-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => openEditModal(certificate)}
                                                >
                                                    <LuClipboardEdit className="mr-1 text-sm" /> Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-gray-500">
                                            No Certificates Available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <MedicalCertificateModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedCertificate={selectedCertificate}
                        isEditing={isEditing}
                        isViewing={isViewing}
                    />
                )}

                <ConfirmDeleteModal
                    isOpen={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={confirmDeleteHandler}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the certificate for "${certificateToDelete?.patient_name}"?`}
                />
            </PatientLayout>
        </Suspense>
    );
};

export default MedicalCertificate;
