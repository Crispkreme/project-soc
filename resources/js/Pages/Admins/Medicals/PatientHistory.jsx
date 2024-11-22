import React, { Suspense, useState } from "react";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const HealthHistoryModal = React.lazy(() => import("./HealthHistoryModal"));

const PatientHistory = ({
    patients,
    healthRecords,
    surgicalRecords,
    medicationRecords,
    familyMedicalRecords,
}) => {
    console.log();
    const [showModal, setShowModal] = useState(false);
    const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
  
    const toggleModal = (healthRecord = null, isEditing = false, isViewing = false) => {
      setSelectedHealthRecord(healthRecord);
      setShowModal(!showModal);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Patient Record" />

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">
                                Manage Patient History
                            </div>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Health History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                    <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-medium">Manage Health History</h2>
                                    <button
                                        type="button"
                                        className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                        onClick={() => toggleModal(null, false, false)}
                                    >
                                        <HiOutlinePlusSm className="mr-1" /> Add Health History
                                    </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="p-4">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            </th>
                                            <th scope="col" className="px-6 py-3">ID</th>
                                            <th scope="col" className="px-6 py-3">Illness</th>
                                            <th scope="col" className="px-6 py-3">Illness Description</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {healthRecords.length > 0 ? (
                                            healthRecords.map((healthRecord, index) => (
                                            <tr key={healthRecord.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                </td>
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {index + 1}
                                                </th>
                                                <td className="px-6 py-4">{healthRecord.name}</td>
                                                <td className="px-6 py-4">{healthRecord.description}</td>
                                                <td className="px-6 py-4">
                                                {format(new Date(healthRecord.created_at), "MMMM d, yyyy")}
                                                </td>
                                                <td className="px-6 py-4">
                                                <button
                                                    className="bg-blue-50 text-blue-400 hover:text-blue-600 text-xs font-medium py-1 px-2 flex items-center"
                                                    onClick={() => toggleModal(healthRecord, true, false)} // Open modal for editing
                                                >
                                                    <LuClipboardEdit className="mr-1 text-sm" /> Edit
                                                </button>
                                                </td>
                                            </tr>
                                            ))
                                        ) : (
                                            <tr>
                                            <td colSpan={6} className="text-center py-4 text-gray-500">
                                                No health records available.
                                            </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                    </div>
                                </div>
                                </div>
                            </Accordion>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Surgical History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <table
                                                className="w-full min-w-[540px]"
                                                data-tab-for="order"
                                                data-page="active"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Surgery
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Procedure
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Doctor
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {surgicalRecords.length >
                                                    0 ? (
                                                        surgicalRecords.map(
                                                            (
                                                                surgicalRecord
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        surgicalRecord.id
                                                                    }
                                                                >
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                surgicalRecord.procedure
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                surgicalRecord.description
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                surgicalRecord.doctor_name
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {format(
                                                                                new Date(
                                                                                    surgicalRecord.created_at
                                                                                ),
                                                                                "MMMM d, yyyy"
                                                                            )}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-2 border-b border-b-gray-50">
                                                                        <div className="flex space-x-2">
                                                                            {/* <WarningButton onClick={() => openViewModal(inventory)}>
                                    <SlEyeglass />
                                </WarningButton>
                                <SecondaryButton onClick={() => openEditModal(inventory)}>
                                    <LuClipboardEdit />
                                </SecondaryButton>
                                <DangerButton>
                                    <RiDeleteBin5Line />
                                </DangerButton> */}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                className="text-center py-4 text-gray-500"
                                                            >
                                                                No Surgical
                                                                History
                                                                Available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Medication History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <table
                                                className="w-full min-w-[540px]"
                                                data-tab-for="order"
                                                data-page="active"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Medicine Name
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Dosage
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Reason/For:
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Date
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {medicationRecords.length >
                                                    0 ? (
                                                        medicationRecords.map(
                                                            (
                                                                medicationRecord
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        medicationRecord.id
                                                                    }
                                                                >
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                medicationRecord
                                                                                    .medicine
                                                                                    .medicine_name
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                medicationRecord.dosage
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                medicationRecord.reason
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {format(
                                                                                new Date(
                                                                                    medicationRecord.created_at
                                                                                ),
                                                                                "MMMM d, yyyy"
                                                                            )}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-2 border-b border-b-gray-50">
                                                                        <div className="flex space-x-2">
                                                                            {/* <WarningButton onClick={() => openViewModal(inventory)}>
                                    <SlEyeglass />
                                </WarningButton>
                                <SecondaryButton onClick={() => openEditModal(inventory)}>
                                    <LuClipboardEdit />
                                </SecondaryButton>
                                <DangerButton>
                                    <RiDeleteBin5Line />
                                </DangerButton> */}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                className="text-center py-4 text-gray-500"
                                                            >
                                                                No Medication
                                                                History
                                                                Available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Family Medical History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <table
                                                className="w-full min-w-[540px]"
                                                data-tab-for="order"
                                                data-page="active"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Desease
                                                        </th>
                                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">
                                                            Relationship
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {familyMedicalRecords.length >
                                                    0 ? (
                                                        familyMedicalRecords.map(
                                                            (
                                                                familyMedicalRecord
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        familyMedicalRecords.id
                                                                    }
                                                                >
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                familyMedicalRecord.disease
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                                                        <span className="text-[13px] font-medium text-gray-400">
                                                                            {
                                                                                familyMedicalRecord.relationship_disease
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                className="text-center py-4 text-gray-500"
                                                            >
                                                                No Family
                                                                Medical History
                                                                Available.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </AdminLayout>

            <HealthHistoryModal
                showModal={showModal}
                toggleModal={toggleModal}
                selectedHealthRecord={selectedHealthRecord}
                patient_id={healthRecords[0].patient_id}
                patients={patients}
                isEditing={selectedHealthRecord != null && true}
                isViewing={false}
            />
        </Suspense>
    );
};

export default PatientHistory;
