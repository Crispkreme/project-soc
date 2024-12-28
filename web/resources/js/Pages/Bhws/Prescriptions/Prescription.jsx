import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Table = React.lazy(() => import("@/Components/Table"));

const Referral = ({ prescriptions }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPrescriptions, setFilteredPrescriptions] = useState(prescriptions);

    const prescriptionColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "patient_name", label: "Patient Name" },
        { key: "doctor_name", label: "Doctor Name" },
        { key: "instructions", label: "Instruction" },
        { key: "created_at", label: "Created At", render: (date) => formatDate(date) }, 
    ];

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = prescriptions.filter((referral) =>
            referral.patient_name.toLowerCase().includes(query.toLowerCase()) ||
            referral.doctor_name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredPrescriptions(filtered);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(date).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Manage prescriptions" />
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium">Manage Prescription</h2>
                        </div>
                        <div className="pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for prescriptions"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table
                                columns={prescriptionColumn}
                                data={filteredPrescriptions}
                                noDataMessage="No Referral Available."
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
};

export default Referral;
