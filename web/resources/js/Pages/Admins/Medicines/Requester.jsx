import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const StatusButton = React.lazy(() => import("@/Components/Buttons/StatusButton"));
const ApproveMedicineRequesterModal = React.lazy(() => import("@/Components/Forms/ApproveMedicineRequesterModal"));

const Requester = ({ medicineRequesters, medicines }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedMedicineRequester, setSelectedMedicineRequester] = useState(null);

    const toggleModal = (requester = null) => {
        setSelectedMedicineRequester(requester);
        setShowModal(!showModal);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMedicineRequester(null);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Manage Medicine Requests" />

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Medicine Requests</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]" data-tab-for="medicineRequesters" data-page="active">
                                <thead>
                                    <tr>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Patient Name</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Medicine</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Quantity</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Reason</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicineRequesters.length > 0 ? medicineRequesters.map((requester, index) => (
                                        <tr key={`${requester.id}-${requester.medicine_name}`}>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{requester.patient_name}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{requester.medicine_name}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{requester.quantity}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{requester.reason}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{new Date(requester.created_at).toLocaleDateString()}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <StatusButton
                                                    status={requester.medication_status}
                                                    onClick={() => toggleModal(requester)}
                                                />
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4 text-gray-500">No Medicine Requests Available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showModal && selectedMedicineRequester && (
                    <ApproveMedicineRequesterModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedMedicineRequester={selectedMedicineRequester}
                        medicines={medicines}
                    />
                )}
            </AdminLayout>
        </Suspense>
    );
};

export default Requester;
