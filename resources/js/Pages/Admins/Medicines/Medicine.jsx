import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import { SlEyeglass } from "react-icons/sl";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const MedicineModal = React.lazy(() => import("./MedicineModal"));
const SecondaryButton = React.lazy(() => import("@/Components/Buttons/SecondaryButton"));
const DangerButton = React.lazy(() => import("@/Components/Buttons/DangerButton"));
const WarningButton = React.lazy(() => import("@/Components/Buttons/WarningButton"));

const Medicine = ({ medicines }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const closeModal = () => {
        setShowModal(false); 
    };

    const openViewModal = (medicine) => {        
        if (medicine.id !== undefined) {
            console.log(`Medicine ID is defined: ${medicine.id}`);
        }
        setSelectedMedicine(medicine); 
        setIsEditing(false); 
        setIsViewing(true); 
        setShowModal(true); 
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                
                <Head title="Accounts" />

                <div className='grid grid-cols-1 gap-6 mb-6'>
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Accounts</div>
                        </div>
                        <div className="flex items-center mb-4 order-tab justify-between">
                            <div className="flex">
                                <button type="button" data-tab="order" data-tab-page="active" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">
                                    Out of Stock
                                </button>
                                <button type="button" data-tab="order" data-tab-page="deactive" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">
                                    On Hand
                                </button>
                            </div>

                            <button 
                                type="button" 
                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                onClick={() => { toggleModal(); }}
                            >
                                <HiOutlinePlusSm className="mr-1" /> Medicine
                            </button>

                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                                <thead>
                                    <tr>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Medicine Name</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Medicine Description</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {medicines.length > 0 ? medicines.map((medicine) => (
                                    <tr key={`${medicine.id}-${medicine.medicine_name}`}>
                                        <td className="py-2 px-4 border-b border-b-gray-50">
                                            <span className="text-[13px] font-medium text-gray-400">{medicine.medicine_name}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b border-b-gray-50">
                                            <span className="text-[13px] font-medium text-gray-400">{medicine.description}</span>
                                        </td>
                                        <td className="py-2 px-2 border-b border-b-gray-50">
                                            <div className="flex space-x-2">
                                                <WarningButton onClick={() => openViewModal(medicine)} >
                                                    <SlEyeglass />
                                                </WarningButton>
                                                <SecondaryButton>
                                                    <LuClipboardEdit />
                                                </SecondaryButton>
                                                <DangerButton>
                                                    <RiDeleteBin5Line />
                                                </DangerButton>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-4 text-gray-500">{t('No Medicine Available')}.</td>
                                    </tr>
                                )}      
                                </tbody>
                            </table>
                        </div>
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

            </AdminLayout>
        </Suspense>
    )
}

export default Medicine