import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";
import { SlEyeglass } from "react-icons/sl";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const StockModal = React.lazy(() => import("./StockModal"));

const Inventory = ({ inventories, medicines }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedInventory(null);
        setIsEditing(false);
        setIsViewing(false);
    };

    const openViewModal = (inventory) => {
        setSelectedInventory(inventory);
        setIsEditing(false);
        setIsViewing(true);
        openModal();
    };

    const openEditModal = (inventory) => {
        setSelectedInventory(inventory);
        setIsEditing(true);
        setIsViewing(false);
        openModal();
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Inventory" />
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium">Manage Inventory</h2>
                            <button
                                type="button"
                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                onClick={openModal}
                            >
                                <HiOutlinePlusSm className="mr-1" /> Add Inventory
                            </button>
                        </div>
                        <div className="pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for inventory"
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
                                        <th className="px-6 py-3">Dispense</th>
                                        <th className="px-6 py-3">In-Stock</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventories.length > 0 ? (
                                        inventories.map((inventory, index) => (
                                            <tr
                                                key={inventory.id}
                                                className="bg-white border-b hover:bg-gray-50"
                                            >
                                                <td className="p-4">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">{inventory.medicine_name}</td>
                                                <td className="px-6 py-4">{inventory.description}</td>
                                                <td className="px-6 py-4">{inventory.sold}</td>
                                                <td className="px-6 py-4">{inventory.in_stock}</td>
                                                <td className="px-6 py-4 flex space-x-2">
                                                    <button
                                                        className="bg-yellow-50 text-yellow-400 hover:text-yellow-600 text-xs font-medium py-1 px-2 flex items-center"
                                                        onClick={() => openViewModal(inventory)}
                                                    >
                                                        <SlEyeglass className="mr-1 text-sm" /> View
                                                    </button>
                                                    <button
                                                        className="bg-blue-50 text-blue-400 hover:text-blue-600 text-xs font-medium py-1 px-2 flex items-center"
                                                        onClick={() => openEditModal(inventory)}
                                                    >
                                                        <LuClipboardEdit className="mr-1 text-sm" /> Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-4 text-gray-500"
                                            >
                                                No Inventory Available.
                                            </td>
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
                        isEditing={isEditing}
                        isViewing={isViewing}
                    />
                )}
            </AdminLayout>
        </Suspense>
    );
};

export default Inventory;
