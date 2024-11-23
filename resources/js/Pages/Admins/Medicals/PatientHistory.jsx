import React, { Suspense, useState } from "react";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const Table = React.lazy(() => import("@/Components/Table"));
const HealthHistoryModal = React.lazy(() => import("@/Components/Forms/HealthHistoryModal"));
const SurgicalHistoryModal = React.lazy(() => import("@/Components/Forms/SurgicalHistoryModal"));

const healthRecordColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "name", label: "Illness" },
    { key: "description", label: "Illness Description" },
    {
      key: "created_at",
      label: "Date",
      render: (value) => format(new Date(value), "MMMM d, yyyy"),
    },
];
const surgicalRecordColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "procedure", label: "Surgery" },
    { key: "description", label: "Procedure" },
    { key: "doctor_name", label: "Doctor" },
    {
      key: "created_at",
      label: "Date",
      render: (value) => format(new Date(value), "MMMM d, yyyy"),
    },
];
const medicationRecordColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "medicine.medicine_name", label: "Medicine Name" },
    { key: "dosage", label: "Dosage" },
    { key: "reason", label: "Reason/For:" },
    {
      key: "created_at",
      label: "Date",
      render: (value) => format(new Date(value), "MMMM d, yyyy"),
    },
];
const medicationRecordAction = [
    {
      label: "Edit",
      icon: LuClipboardEdit,
      onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
    },
];
const familyMedicalRecordColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "disease", label: "Desease" },
    { key: "relationship_disease", label: "Relationship" },
    {
      key: "created_at",
      label: "Date",
      render: (value) => format(new Date(value), "MMMM d, yyyy"),
    },
];
const familyMedicalRecordAction = [
    {
      label: "Edit",
      icon: LuClipboardEdit,
      onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
    },
];

const PatientHistory = ({ patients, doctors, healthRecords, surgicalRecords, medicationRecords, familyMedicalRecords,}) => {

    const transformedDoctors = doctors.map(doctor => ({
        value: doctor.id,
        option: `${doctor.firstname} ${doctor.middlename} ${doctor.lastname}`
    }));

    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showSurgicalModal, setShowSurgicalModal] = useState(false);
    const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
    const [selectedSurgicalRecord, setSelectedSurgicalRecord] = useState(null);

    const toggleHealthModal = (healthRecord = null) => {
        setSelectedHealthRecord(healthRecord);
        setShowHealthModal(!!healthRecord || !showHealthModal);
    };
    const toggleSurgicalModal = (surgicalRecord = null) => {
        setSelectedSurgicalRecord(surgicalRecord);
        setShowSurgicalModal(!!surgicalRecord || !showSurgicalModal);
    };
    const closeModals = () => {
        setShowHealthModal(false);
        setShowSurgicalModal(false);
    };
    const healthRecordAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => {
                console.log("Row data:", row);
                toggleHealthModal(row);
              },
        },
    ];
    const surgicalRecordAction = [
        {
          label: "Edit",
          icon: LuClipboardEdit,
          onClick: (row) => {
            toggleSurgicalModal(row);
          },
        },
    ];
      

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
                            <Accordion title="Manage Health History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="font-medium">
                                                Manage Health History
                                            </h2>
                                            <button
                                                type="button"
                                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                onClick={() => toggleHealthModal(null)}
                                            >
                                                <HiOutlinePlusSm className="mr-1" />{" "}
                                                Add Health History
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto mt-4">
                                            <Table
                                                columns={healthRecordColumn}
                                                data={healthRecords}
                                                actions={healthRecordAction}
                                                noDataMessage="No Medication History Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Manage Surgical History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="font-medium">
                                                Manage Surgical History
                                            </h2>
                                            <button
                                                type="button"
                                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                onClick={() => toggleSurgicalModal(null)}
                                            >
                                                <HiOutlinePlusSm className="mr-1" />{" "}
                                                Add Surgical History
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto mt-4">
                                            <Table
                                                columns={surgicalRecordColumn}
                                                data={surgicalRecords}
                                                actions={surgicalRecordAction}
                                                noDataMessage="No Surgical Record Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Manage Medication History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="font-medium">
                                                Manage Medication History
                                            </h2>
                                            <button
                                                type="button"
                                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                onClick={() => toggleSurgicalModal(null,false,false)}
                                            >
                                                <HiOutlinePlusSm className="mr-1" />{" "}
                                                Add Medication History
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto mt-4">
                                            <Table
                                                columns={medicationRecordColumn}
                                                data={medicationRecords}
                                                actions={medicationRecordAction}
                                                noDataMessage="No Surgical Record Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Family Medical History">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="font-medium">
                                                Family Medical History
                                            </h2>
                                            <button
                                                type="button"
                                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                onClick={() => toggleSurgicalModal(null,false,false)}
                                            >
                                                <HiOutlinePlusSm className="mr-1" />{" "}
                                                Add Family Medical History
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <Table
                                                columns={familyMedicalRecordColumn}
                                                data={familyMedicalRecords}
                                                actions={familyMedicalRecordAction}
                                                noDataMessage="No Surgical Record Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </AdminLayout>

            <HealthHistoryModal
                showModal={showHealthModal}
                toggleHealthModal={toggleHealthModal} 
                selectedHealthRecord={selectedHealthRecord}
                patient_id={patients[0]?.id}
                patients={patients}
                isEditing={!!selectedHealthRecord}
            />

            <SurgicalHistoryModal
                showModal={showSurgicalModal}
                toggleSurgicalModal={toggleSurgicalModal}
                selectedSurgicalRecord={selectedSurgicalRecord}
                patient_id={patients[0]?.id}
                isEditing={!!selectedSurgicalRecord}
                doctors={transformedDoctors}
            />

        </Suspense>
    );
};

export default PatientHistory;
