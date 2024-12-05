import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";
import { PiEyeBold } from "react-icons/pi";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const MedicineModal = React.lazy(() => import("./MedicineModal"));
const ConfirmDeleteModal = React.lazy(() => import("@/Components/Modals/ConfirmDeleteModal"));

const Medicine = ({ medicines }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMedicines, setFilteredMedicines] = useState(medicines);

    const toggleModal = () => setShowModal(!showModal);
    const closeModal = () => setShowModal(false);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        const filtered = medicines.filter(medicine =>
            medicine.medicine_name.toLowerCase().includes(query.toLowerCase()) ||
            medicine.description.toLowerCase().includes(query.toLowerCase())
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

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Manage Medicines" />

                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium">Manage Medicines</h2>
                        <button
                            type="button"
                            className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                            onClick={toggleModal}
                        >
                            <HiOutlinePlusSm className="mr-1" /> Add Medicine
                        </button>
                    </div>

                    <div className="pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="table-search"
                                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for medicines"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="p-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Medicine Name</th>
                                    <th className="px-6 py-3">Description</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.length > 0 ? (
                                    filteredMedicines.map((medicine, index) => (
                                        <tr key={medicine.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4">{medicine.medicine_name}</td>
                                            <td className="px-6 py-4">{medicine.description}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="bg-yellow-50 text-yellow-400 hover:text-yellow-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => openViewModal(medicine)}
                                                >
                                                    <PiEyeBold className="mr-1 text-sm" /> View
                                                </button>
                                                <button
                                                    className="bg-blue-50 text-blue-400 hover:text-blue-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => openEditModal(medicine)}
                                                >
                                                    <LuClipboardEdit className="mr-1 text-sm" /> Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">
                                            No Medicines Available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showModal && (
                    <MedicineModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedMedicine={selectedMedicine}
                        isEditing={isEditing}
                        isViewing={isViewing}
                    />
                )}

                <ConfirmDeleteModal
                    isOpen={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={confirmDeleteHandler}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete "${medicineToDelete?.medicine_name}"?`}
                />
            </AdminLayout>
        </Suspense>
    );
};

export default Medicine;