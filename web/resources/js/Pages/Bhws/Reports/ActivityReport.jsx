import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Table = React.lazy(() => import("@/Components/Table"));

const ActivityReport = ({ barangayEvents }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBarangayEvents, setFilteredBarangayEvents] = useState(barangayEvents);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = barangayEvents.filter((event) => {
            const doctorName = event.doctor_name?.toLowerCase() || "";
            const bhwName = event.bhw_name?.toLowerCase() || "";
            return (
                event.event_name.toLowerCase().includes(query) ||
                doctorName.includes(query) ||
                bhwName.includes(query)
            );
        });

        setFilteredBarangayEvents(filtered);
    };

    const barangayEventColumn = [
        { key: "doctor_name", label: "Doctor Name" },
        { key: "bhw_name", label: "In Charge" },
        { key: "event_name", label: "Event" },
        { key: "event_venue", label: "Venue" },
        { key: "event_time", label: "Time" },
        { key: "event_date", label: "Date of Event" },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Barangay Events" />
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium">Manage Barangay Events Reports</h2>
                        </div>
                        <div className="pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for Barangay Event"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <Table
                                columns={barangayEventColumn}
                                data={filteredBarangayEvents}
                                noDataMessage="No Barangay Events Available."
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
};

export default ActivityReport;
