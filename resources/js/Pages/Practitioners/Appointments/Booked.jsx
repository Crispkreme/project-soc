import React, { useState, Suspense } from "react";
import PatientLayout from "@/Layouts/PatientLayout";
import { LuClipboardEdit } from "react-icons/lu";
import Table from "@/Components/Table";

const ReferralModal = React.lazy(() => import("@/Components/Forms/ReferralModal"));
const PrescriptionModal = React.lazy(() => import("@/Components/Forms/PrescriptionModal"));

const Booked = ({ bookings, doctors, patients, hospitals, medicines }) => {
    const [filteredBookings, setFilteredBookings] = useState(bookings);
    const [searchQuery, setSearchQuery] = useState("");
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState(null);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = bookings.filter(
            (booking) =>
                booking.medicine_name
                    ?.toLowerCase()
                    .includes(query.toLowerCase()) ||
                booking.description
                    ?.toLowerCase()
                    .includes(query.toLowerCase())
        );

        setFilteredBookings(filtered);
    };

    const handleReferralClick = (row) => {
        setSelectedReferral(row);
        setShowReferralModal(true);
    };

    const handlePrescriptionClick = (row) => {
        setSelectedReferral(row);
        setShowPrescriptionModal(true);
    };

    const toggleReferralModal = () => {
        setShowReferralModal(false);
        setSelectedReferral(null);
    };

    const togglePrescriptionModal = () => {
        setShowPrescriptionModal(false);
        setSelectedReferral(null);
    };

    const BookingColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "patient_name", label: "Patient" },
        { key: "title", label: "Appointment" },
        { key: "booking_status", label: "Status" },
    ];

    const bookingAction = [
        {
            label: "View",
            icon: LuClipboardEdit,
            onClick: (row) => console.log("View clicked", row),
            style: "bg-yellow-300 text-yellow-800 hover:bg-yellow-400",
        },
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => console.log("Edit clicked", row),
            style: "bg-blue-300 text-blue-800 hover:bg-blue-400",
        },
    ];

    const prescriptionAction = [
        {
            label: "Prescription",
            icon: LuClipboardEdit,
            onClick: (row) => handlePrescriptionClick(row), // Handle click for Prescription Modal
            style: "bg-green-300 text-green-800 hover:bg-green-400",
        },
    ];

    const referralAction = [
        {
            label: "Referral",
            icon: LuClipboardEdit,
            onClick: (row) => handleReferralClick(row),
            style: "bg-purple-300 text-purple-800 hover:bg-purple-400",
        },
    ];

    const getActionButtons = (row) => {
        const isDisabled = row.booking_status === "Success" || row.booking_status === "Approve";
    
        return {
            bookingActions: bookingAction.map((action) => (
                <button
                    key={action.label}
                    onClick={() => action.onClick(row)}
                    className={`inline-flex items-center px-4 py-2 mr-2 rounded-md text-sm font-medium ${action.style}`}
                >
                    <action.icon className="mr-2" />
                    {action.label}
                </button>
            )),
            prescriptionActions: prescriptionAction.map((action) => (
                <button
                    key={action.label}
                    onClick={() => !isDisabled && action.onClick(row)} // Prevent click if disabled
                    disabled={isDisabled} // Disable the button
                    className={`inline-flex items-center px-4 py-2 mr-2 rounded-md text-sm font-medium ${
                        isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : action.style
                    }`}
                >
                    <action.icon className="mr-2" />
                    {action.label}
                </button>
            )),
            referralActions: referralAction.map((action) => (
                <button
                    key={action.label}
                    onClick={() => !isDisabled && action.onClick(row)} // Prevent click if disabled
                    disabled={isDisabled} // Disable the button
                    className={`inline-flex items-center px-4 py-2 mr-2 rounded-md text-sm font-medium ${
                        isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : action.style
                    }`}
                >
                    <action.icon className="mr-2" />
                    {action.label}
                </button>
            )),
        };
    };   

    return (
        <Suspense>
            <PatientLayout>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-medium">Manage Bookings</h2>
                            </div>
                            <div className="pb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="table-search"
                                        className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search for bookings"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <Table
                                    columns={[
                                        ...BookingColumn,
                                        {
                                            key: "referralAction",
                                            label: "Referral Action",
                                        },
                                        {
                                            key: "prescriptionAction",
                                            label: "Prescription Action",
                                        },
                                        { key: "action", label: "Action" },
                                    ]}
                                    data={filteredBookings.map((row) => ({
                                        ...row,
                                        referralAction: getActionButtons(row).referralActions,
                                        prescriptionAction: getActionButtons(row).prescriptionActions,
                                        action: getActionButtons(row).bookingActions,
                                    }))}
                                    renderRow={(row) => (
                                        <tr key={row.id}>
                                            <td className="px-6 py-3">{row.id}</td>
                                            <td className="px-6 py-3">{row.patient_name}</td>
                                            <td className="px-6 py-3">{row.title}</td>
                                            <td className="px-6 py-3">{row.booking_status}</td>
                                            <td className="px-6 py-3">{row.referralAction}</td>
                                            <td className="px-6 py-3">{row.prescriptionAction}</td>
                                            <td className="px-6 py-3 flex">{row.action}</td>
                                        </tr>
                                    )}
                                    noDataMessage="No Bookings Available."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {showReferralModal && (
                    <ReferralModal
                        showModal={showReferralModal}
                        toggleReferralModal={toggleReferralModal}
                        selectedReferral={selectedReferral}
                        doctors={doctors}
                        patients={patients}
                        hospitals={hospitals}
                    />
                )}

                {showPrescriptionModal && (
                    <PrescriptionModal
                        showModal={showPrescriptionModal}
                        toggleReferralModal={togglePrescriptionModal}
                        selectedReferral={selectedReferral}
                        medicines={medicines}
                    />
                )}
            </PatientLayout>
        </Suspense>
    );
};

export default Booked;
