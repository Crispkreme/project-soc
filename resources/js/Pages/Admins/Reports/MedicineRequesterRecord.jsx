import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';
import Table from '@/Components/Table';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));

const MedicineRequesterRecord = ({ medicineRequesters }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRequesters, setFilteredRequesters] = useState(medicineRequesters);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = medicineRequesters.filter(({ patient_name, medicine_name, reason }) =>
            patient_name.toLowerCase().includes(query) ||
            medicine_name.toLowerCase().includes(query) ||
            reason.toLowerCase().includes(query)
        );

        setFilteredRequesters(filtered);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const medicineRequesterColumns = [
        { key: "patient_name", label: "Patient Name" },
        { key: "medicine_name", label: "Medicine Name" },
        { key: "quantity", label: "Quantity" },
        { key: "reason", label: "Reason" },
        { 
            key: "created_at", 
            label: "Created At", 
            render: (value) => formatDate(value),
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Manage Medicine Requests" />

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Medicine Requests</div>
                        </div>

                        <div className="pb-4">
                            <label htmlFor="table-search" className="sr-only">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for requests"
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

                        <div className="overflow-x-auto">
                            <Table
                                columns={medicineRequesterColumns}
                                data={filteredRequesters}
                                noDataMessage="No Medicine Requests Available."
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
};

export default MedicineRequesterRecord;
