import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const StockModal = React.lazy(() => import("@/Components/Forms/StockModal"));
const Table = React.lazy(() => import("@/Components/Table"));
const InventoryModal = React.lazy(() => import("@/Components/Forms/InventoryModal"));

const Inventory = ({ inventories, medicines }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredInventories, setFilteredInventories] = useState(inventories);

    const [selectedInventory, setSelectedInventory] = useState(null);

    const toggleInventoryModal = (inventory = null, isEditing = false, isViewing = false) => {
        setSelectedInventory(inventory);
        setIsEditing(isEditing);
        setIsViewing(isViewing);
        setShowModal(!showModal);
    };

    const InventoryColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "medicine_name", label: "Medicine Name" },
        { key: "description", label: "Description" },
        { key: "sold", label: "Dispense" },
        { key: "in_stock", label: "In-Stock" },
    ];

    const inventoryAction = [
        {
            label: "View",
            icon: LuClipboardEdit,
            onClick: (row) => toggleInventoryModal(row, false, true),
            style: "bg-yellow-300 text-yellow-800 hover:bg-yellow-400"
        },
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => toggleInventoryModal(row, true, false),
            style: "bg-blue-300 text-blue-800 hover:bg-blue-400"
        },
    ];

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = inventories.filter((inventory) =>
            inventory.medicine_name.toLowerCase().includes(query.toLowerCase()) ||
            inventory.description.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredInventories(filtered);
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
                                onClick={() => toggleInventoryModal(null)}
                            >
                                <HiOutlinePlusSm className="mr-1" />{" "}
                                Add Inventory
                            </button>
                        </div>
                        <div className="pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for inventory"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table
                                columns={InventoryColumn}
                                data={filteredInventories}
                                actions={inventoryAction}
                                renderActions={(action, row) => (
                                    <button
                                        key={action.label}
                                        onClick={() => action.onClick(row)}
                                        className={`inline-flex items-center px-4 py-2 mr-2 rounded-md text-sm font-medium ${action.style}`}
                                    >
                                        <action.icon className="mr-2" />
                                        {action.label}
                                    </button>
                                )}
                                noDataMessage="No Surgical Record Available."
                            />
                        </div>
                    </div>
                </div>

                <InventoryModal
                    showModal={showModal}
                    toggleInventoryModal={toggleInventoryModal}
                    selectedInventory={selectedInventory}
                    isEditing={isEditing}
                    isViewing={isViewing}
                    medicines={medicines}
                />
            </AdminLayout>
        </Suspense>
    );
};

export default Inventory;
