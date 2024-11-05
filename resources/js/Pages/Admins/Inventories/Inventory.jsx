import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import { SlEyeglass } from "react-icons/sl";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const StockModal = React.lazy(() => import("./StockModal"));
const SecondaryButton = React.lazy(() => import("@/Components/Buttons/SecondaryButton"));
const SuccessButton = React.lazy(() => import("@/Components/Buttons/SuccessButton"));
const DangerButton = React.lazy(() => import("@/Components/Buttons/DangerButton"));
const WarningButton = React.lazy(() => import("@/Components/Buttons/WarningButton"));

const Medicine = ({ inventories, medicines }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const closeModal = () => {
        setShowModal(false); 
    };

    const openViewModal = (inventory) => {
        setSelectedInventory(inventory); 
        setIsEditing(false); 
        setIsViewing(true); 
        setShowModal(true); 
    };

    const openEditModal = (inventory) => {
        setSelectedInventory(inventory); 
        setIsEditing(true); 
        setIsViewing(false); 
        setShowModal(true);  
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Accounts" />
                <div className='grid grid-cols-1 gap-6 mb-6'>
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Stocks</div>
                        </div>
                        <div className="flex items-center mb-4 order-tab justify-between">
                            <div className="flex">
                                <button type="button" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">
                                    Out of Stock
                                </button>
                                <button type="button" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">
                                    On Hand
                                </button>
                            </div>
                            <SuccessButton onClick={toggleModal}>
                                <HiOutlinePlusSm className="mr-1" /> Medicine
                            </SuccessButton>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                                <thead>
                                    <tr>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Medicine Name</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Medicine Description</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Sold</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">In-Stock</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {inventories.length > 0 ? inventories.map((inventory) => (
                                    <tr key={inventory.id}>
                                        <td className="py-2 px-4 border-b border-b-gray-50">
                                            <span className="text-[13px] font-medium text-gray-400">{inventory.medicine_name}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b border-b-gray-50">
                                            <span className="text-[13px] font-medium text-gray-400">{inventory.description}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b border-b-gray-50">
                                            <span className="text-[13px] font-medium text-gray-400">{inventory.sold}</span>
                                        </td>
                                        <td className="py-2 px-4 border-b border-b-gray-50">
                                            <span className="text-[13px] font-medium text-gray-400">{inventory.in_stock}</span>
                                        </td>
                                        <td className="py-2 px-2 border-b border-b-gray-50">
                                            <div className="flex space-x-2">
                                                <WarningButton onClick={() => openViewModal(inventory)}>
                                                    <SlEyeglass />
                                                </WarningButton>
                                                <SecondaryButton onClick={() => openEditModal(inventory)}>
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
                                        <td colSpan={5} className="text-center py-4 text-gray-500">No Medicine Available.</td>
                                    </tr>
                                )}      
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <StockModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedInventory={selectedInventory}
                        medicines={medicines}
                        isEditing={isEditing}
                        isViewing={isViewing}
                    />
                )}
            </AdminLayout>
        </Suspense>
    );
};

export default Medicine;
