import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const InventoryModal = React.lazy(() => import("@/Components/Forms/InventoryModal"));
const Table = React.lazy(() => import("@/Components/Table"));

const MedicineReport = ({ inventories }) => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredInventories, setFilteredInventories] = useState([]);

    const inventoriesArray = Object.values(inventories);

    const toggleInventoryModal = (inventory = null, isEditing = false, isViewing = false) => {
        setIsEditing(isEditing);
        setIsViewing(isViewing);
        setShowModal(!showModal);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = inventoriesArray.filter((inventory) =>
            inventory.medicine_name.toLowerCase().includes(query) ||
            inventory.description.toLowerCase().includes(query)
        );

        setFilteredInventories(filtered);
    };

    const InventoryColumn = [
        { key: "medicine_name", label: "Medicine Name" },
        { key: "description", label: "Description" },
        { key: "dosage", label: "Dosage" },
        { key: "expiration_date", label: "Expiration" },
        { key: "sold", label: "Dispense" },
        { key: "in_stock", label: "Quantity" },
    ];

    const inventoryAction = [
        {
            label: "View",
            icon: LuClipboardEdit,
            onClick: (row) => toggleInventoryModal(row, false, true),
        },
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => toggleInventoryModal(row, true, false),
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Inventory" />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Medicine Available</h2>
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search Inventory"
                            className="w-80 p-2 border rounded"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <Table
                        columns={InventoryColumn}
                        data={filteredInventories.length ? filteredInventories : inventoriesArray}
                        actions={inventoryAction}
                        noDataMessage="No Inventory Available."
                    />
                </div>
                {showModal && (
                    <InventoryModal
                        showModal={showModal}
                        toggleInventoryModal={toggleInventoryModal}
                        selectedInventory={null}
                        isEditing={isEditing}
                        isViewing={isViewing}
                        medicines={medicines}
                    />
                )}
            </AdminLayout>
        </Suspense>
    );
};

export default MedicineReport;
