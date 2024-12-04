import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import Table from '@/Components/Table';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const InventoryReport = ({ inventories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredInventories, setFilteredInventories] = useState(inventories);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = inventories.filter(({ medicine_name, description }) =>
            medicine_name.toLowerCase().includes(query) ||
            description.toLowerCase().includes(query)
        );

        setFilteredInventories(filtered);
    };

    const InventoryRecordColumn = [
        { key: "medicine_name", label: "Medicine Name" },
        { key: "description", label: "Description" },
        { key: "dosage", label: "Dosage" },
        { 
            key: "expiration_date", 
            label: "Expiration", 
            render: (value) => formatDate(value) // Format expiration dates
        },
        { key: "sold", label: "Dispense" },
        { key: "in_stock", label: "Quantity" },
    ];

    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><p>Loading...</p></div>}>
            <AdminLayout>
                <Head title="Inventory Report" />

                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium text-lg">Manage Inventory Reports</h2>
                    </div>

                    {/* Search Bar */}
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
                            <svg
                                className="absolute left-3 top-3 w-5 h-5 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2a8 8 0 104.938 14.598l5.664 5.663a1 1 0 001.415-1.414l-5.663-5.664A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table
                            columns={InventoryRecordColumn}
                            data={filteredInventories}
                            noDataMessage="No Inventory Record Available."
                        />
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
};

export default InventoryReport;
