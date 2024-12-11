import React, { useState, useEffect, Suspense } from "react";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { PiEyeBold } from "react-icons/pi";
import { FaDownload } from "react-icons/fa";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const ConfirmDeleteModal = React.lazy(() => import("@/Components/Modals/ConfirmDeleteModal"));

const MedicalCertificate = ({ medicalCertificates }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCertificates, setFilteredCertificates] = useState(medicalCertificates);

    // Debounce function to optimize search
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // Filter certificates based on search query
    const handleSearch = (query) => {
        const filtered = medicalCertificates.filter((certificate) =>
            [certificate.purpose, certificate.patient_name, certificate.doctor_name, certificate.issue_date, certificate.examin_date]
                .filter(Boolean) // Ignore null or undefined values
                .some((field) => field.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredCertificates(filtered);
    };

    const debouncedSearch = debounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery]);

    const confirmDeleteHandler = () => {
        if (certificateToDelete) {
            Inertia.delete(route("admin.delete.medical_certificates", certificateToDelete.id), {
                onSuccess: () => {
                    setConfirmDelete(false);
                    setCertificateToDelete(null);
                },
                onError: () => console.error("Error deleting medical certificate"),
            });
        }
    };

    const handleViewPDF = (certificateId) => {
        window.open(route("medical.certificate.view", { id: certificateId }), "_blank");
    };

    const handleDownloadPDF = (certificateId) => {
        window.location.href = route("medical.certificate.download", { id: certificateId });
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Manage Medical Certificates" />

                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium">Manage Medical Certificates</h2>
                    </div>

                    <div className="pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="table-search"
                                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for certificates"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Purpose</th>
                                    <th className="px-6 py-3">Patient Name</th>
                                    <th className="px-6 py-3">Doctor Name</th>
                                    <th className="px-6 py-3">Examin Date</th>
                                    <th className="px-6 py-3">Issue Date</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCertificates.length > 0 ? (
                                    filteredCertificates.map((certificate, index) => (
                                        <tr
                                            key={certificate.id || `certificate-${index}`}
                                            className="bg-white border-b hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">{certificate.purpose || "N/A"}</td>
                                            <td className="px-6 py-4">{certificate.patient_name || "N/A"}</td>
                                            <td className="px-6 py-4">{certificate.doctor_name || "N/A"}</td>
                                            <td className="px-6 py-4">{certificate.examin_date || "N/A"}</td>
                                            <td className="px-6 py-4">{certificate.issue_date || "N/A"}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="bg-yellow-50 text-yellow-400 hover:text-yellow-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => handleViewPDF(certificate.id)}
                                                >
                                                    <PiEyeBold className="mr-1 text-sm" /> View PDF
                                                </button>
                                                <button
                                                    className="bg-green-50 text-green-400 hover:text-green-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => handleDownloadPDF(certificate.id)}
                                                >
                                                    <FaDownload className="mr-1 text-sm" /> Download PDF
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

                <ConfirmDeleteModal
                    isOpen={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={confirmDeleteHandler}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete the certificate for "${certificateToDelete?.patient_name}"?`}
                />
            </AdminLayout>
        </Suspense>
    );
};

export default MedicalCertificate;
