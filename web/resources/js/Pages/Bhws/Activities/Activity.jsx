import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const BarangayEventModal = React.lazy(() => import("@/Components/Forms/BarangayEventModal"));
const Table = React.lazy(() => import("@/Components/Table"));

const Activity = ({ barangayEvents, doctors, bhws }) => {

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBarangayEvents, setFilteredBarangayEvents] = useState(barangayEvents);
    const [selectedBarangayEvent, setSelectedBarangayEvent] = useState(null);

    // Toggle modal for viewing or editing events
    const toggleBarangayEventModal = (barangayEvent = null, isEditing = false, isViewing = false) => {
        setSelectedBarangayEvent(barangayEvent);
        setIsEditing(isEditing);
        setIsViewing(isViewing);
        setShowModal(!showModal);
    };    

    // Define table columns
    const barangayEventColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "doctor_name", label: "Doctor Name" },
        { key: "bhw_name", label: "In Charge" },
        { key: "event_name", label: "Event" },
        { key: "event_venue", label: "Venue" },
        { 
            key: "event_time", 
            label: "Time", 
            render: (row) => {
                const formatTime = (timeStr) => {
                    // Handle invalid or empty times gracefully
                    if (!timeStr) return 'N/A';
                    
                    const date = new Date(`1970-01-01T${timeStr}Z`); // Convert to Date object (UTC time)
                    if (isNaN(date)) return 'Invalid Time';
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                };
                const start = formatTime(row.event_start || '00:00:00');
                const end = formatTime(row.event_end || '00:00:00');
                return `${start} - ${end}`;
            }
        },
        { 
            key: "event_date", 
            label: "Date", 
            render: (row) => {
                const formatDate = (dateStr) => {
                    const date = new Date(dateStr);
                    if (isNaN(date)) return 'Invalid Date';
                    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
                };
                return formatDate(row.event_date);
            }
        },
    ];          

    // Define table actions
    const barangayEventAction = [
        {
            label: "View",
            icon: LuClipboardEdit,
            onClick: (row) => toggleBarangayEventModal(row, false, true),
            style: "bg-yellow-300 text-yellow-800 hover:bg-yellow-400"
        },
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => toggleBarangayEventModal(row, true, false),
            style: "bg-blue-300 text-blue-800 hover:bg-blue-400"
        },
    ];

    // Handle search functionality
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = barangayEvents.filter((event) => {
            const doctorName = event.doctor_name ? event.doctor_name.toLowerCase() : "";
            const bhwName = event.bhw_name ? event.bhw_name.toLowerCase() : "";
            return (
                event.event_name.toLowerCase().includes(query.toLowerCase()) ||
                doctorName.includes(query.toLowerCase()) ||
                bhwName.includes(query.toLowerCase())
            );
        });

        setFilteredBarangayEvents(filtered);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Barangay Events" />
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium">Manage Barangay Events</h2>
                            <button
                                type="button"
                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                onClick={() => toggleBarangayEventModal(null, false, false)}
                            >
                                <HiOutlinePlusSm className="mr-1" /> Add Barangay Event
                            </button>

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
                                actions={barangayEventAction}
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
                                noDataMessage="No Barangay Events Available."
                            />
                        </div>
                    </div>
                </div>
            </AdminLayout>
            {showModal && <BarangayEventModal 
                showModal={showModal} 
                toggleBarangayEventModal={toggleBarangayEventModal} 
                doctors={doctors} 
                barangayEvents={barangayEvents}
                bhws={bhws}
                isEditing={isEditing}
                isViewing={isViewing}
                selectedBarangayEvent={selectedBarangayEvent}
            />}
        </Suspense>
    );
};

export default Activity;
