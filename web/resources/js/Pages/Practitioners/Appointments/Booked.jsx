import React, { useState, Suspense } from "react";
import PatientLayout from "@/Layouts/PatientLayout";
import { LuClipboardEdit } from "react-icons/lu";
import Table from "@/Components/Table";

const ReferralModal = React.lazy(() => import("@/Components/Forms/ReferralModal"));
const PrescriptionModal = React.lazy(() => import("@/Components/Forms/PrescriptionModal"));
const MedicalCertificateModal = React.lazy(() => import("@/Components/Forms/MedicalCertificateModal"));

const Booked = ({ bookings, doctors, patients, hospitals, medicines }) => {

    console.log("bookings", bookings);

    const [filteredBookings, setFilteredBookings] = useState(bookings);
    const [searchQuery, setSearchQuery] = useState("");
    const [showReferralModal, setShowReferralModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showMedicalModal, setShowMedicalModal] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState(null);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = bookings.filter(
            (booking) =>
                booking.medicine_name?.toLowerCase().includes(query) ||
                booking.description?.toLowerCase().includes(query)
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

    const handleMedicalClick = (row) => {
        setSelectedReferral(row);
        setShowMedicalModal(true);
    };

    const toggleReferralModal = () => {
        setShowReferralModal(false);
        setSelectedReferral(null);
    };

    const togglePrescriptionModal = () => {
        setShowPrescriptionModal(false);
        setSelectedReferral(null);
    };

    const toggleMedicalModal = () => {
        setShowMedicalModal(false);
        setSelectedReferral(null);
    };

    const BookingColumn = [
        { key: "patient_name", label: "Patient" },
        { key: "title", label: "Appointment" },
        { key: "booking_status", label: "Status" },
        { key: "time", label: "Time" },
    ];

    const getActionButtons = (row) => {
        const isDisabled =
            ["Success", "Approve", "Failed", "Cancel"].includes(row.booking_status);

        const createButton = (action, disabled) => (
            <button
                key={action.label}
                onClick={() => !disabled && action.onClick(row)}
                disabled={disabled}
                className={`inline-flex items-center px-4 py-2 mr-2 rounded-md text-sm font-medium ${
                    disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : action.style
                }`}
            >
                <action.icon className="mr-2" />
                {action.label}
            </button>
        );

        const bookingActions = [
            {
                label: "View",
                icon: LuClipboardEdit,
                onClick: (row) => console.log("View clicked", row),
                style: "bg-teal-300 text-teal-800 hover:bg-teal-400",
            },
            {
                label: "Edit",
                icon: LuClipboardEdit,
                onClick: (row) => console.log("Edit clicked", row),
                style: "bg-teal-300 text-teal-800 hover:bg-teal-400",
            },
        ];

        const prescriptionActions = [
            {
                label: "Prescription",
                icon: LuClipboardEdit,
                onClick: handlePrescriptionClick,
                style: "bg-sky-300 text-sky-800 hover:bg-sky-400",
            },
        ];

        const medicalActions = [
            {
                label: "Med-Cert",
                icon: LuClipboardEdit,
                onClick: handleMedicalClick,
                style: "bg-sky-300 text-sky-800 hover:bg-sky-400",
            },
        ];

        const referralActions = [
            {
                label: "Referral",
                icon: LuClipboardEdit,
                onClick: handleReferralClick,
                style: "bg-sky-300 text-sky-800 hover:bg-sky-400",
            },
        ];

        return {
            bookingActions: bookingActions.map((action) =>
                createButton(action, false)
            ),
            prescriptionActions: prescriptionActions.map((action) =>
                createButton(action, isDisabled)
            ),
            medicalActions: medicalActions.map((action) =>
                createButton(action, isDisabled)
            ),
            referralActions: referralActions.map((action) =>
                createButton(action, isDisabled)
            ),
        };
    };

    const tableData = filteredBookings.map((row) => ({
        ...row,
        referralAction: getActionButtons(row).referralActions,
        prescriptionAction: getActionButtons(row).prescriptionActions,
        medicalAction: getActionButtons(row).medicalActions,
        action: getActionButtons(row).bookingActions,
        time: `${row.appointment_start} - ${row.appointment_end}`,
    }));

    return (
        <Suspense fallback={<div>Loading...</div>}>
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
                                        { key: "referralAction", label: "Referral Action" },
                                        { key: "prescriptionAction", label: "Prescription Action" },
                                        { key: "medicalAction", label: "Medical Action" },
                                        { key: "action", label: "Action" },
                                    ]}
                                    data={tableData}
                                    renderRow={(row) => (
                                        <tr key={row.id}>
                                            <td className="px-6 py-3">{row.patient_name}</td>
                                            <td className="px-6 py-3">{row.title}</td>
                                            <td className="px-6 py-3">{row.time}</td>
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
                {showMedicalModal && (
                    <MedicalCertificateModal
                        showModal={showMedicalModal}
                        toggleMedicalModal={toggleMedicalModal}
                        selectedReferral={selectedReferral}
                        doctors={doctors}
                        patients={patients}
                    />
                )}
            </PatientLayout>
        </Suspense>
    );
};

export default Booked;
