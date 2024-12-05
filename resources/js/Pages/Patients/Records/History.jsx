import React, { useState, Suspense } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
import { format } from 'date-fns';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";

const Sample = React.lazy(() => import("@/Components/Sample"));
const Table = React.lazy(() => import("@/Components/Table"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const HealthHistoryModal = React.lazy(() => import("@/Components/Forms/HealthHistoryModal"));
const SurgicalHistoryModal = React.lazy(() => import("@/Components/Forms/SurgicalHistoryModal"));
const FamilyMedicalRecordModal = React.lazy(() => import("@/Components/Forms/FamilyMedicalRecordModal"));
const MedicationRecordModal = React.lazy(() => import("@/Components/Forms/MedicationRecordModal"));

const History = ({ medicines, patients, doctors, healthRecords, surgicalRecords, medicationRecords, familyMedicalRecords }) => {

    const transformedDoctors = doctors.map(doctor => ({
        value: doctor.id,
        option: `${doctor.firstname} ${doctor.middlename} ${doctor.lastname}`
    }));

    const [showFamilyMedicalModal, setShowFamilyModal] = useState(false);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showSurgicalModal, setShowSurgicalModal] = useState(false);

    const [selectedFamilyMedicalRecord, setSelectedFamilyMedicalRecord] = useState(null);
    const [selectedMedicationRecord, setSelectedMedicationRecord] = useState(null);
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
    const toggleFamilyMedicalModal = (familyMedical = null) => {
        setSelectedFamilyMedicalRecord(familyMedical);
        setShowFamilyModal(!!familyMedical || !showFamilyMedicalModal);
    };
    const toggleMedicationModal = (medication = null) => {
        setSelectedMedicationRecord(medication);
        setShowMedicationModal(!!medication || !showMedicationModal);
    };    

    const healthRecordAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => {
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
    const familyMedicalRecordAction = [
        {
          label: "Edit",
          icon: LuClipboardEdit,
          onClick: (row) => toggleFamilyMedicalModal(row, true, false, row.id),
        },
    ];
    const medicationRecordAction = [
        {
          label: "Edit",
          icon: LuClipboardEdit,
          onClick: (row) => toggleMedicationModal(row, true, false, row.id),
        },
    ];

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
        { key: "id", label: "ID", render: (_, row, index) => index !== undefined ? index + 1 : "N/A" },
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
        { key: "id", label: "ID", render: (_, row, index) => index !== undefined ? index + 1 : "N/A" },
        { key: "medicine.medicine_name", label: "Medicine Name" },
        { key: "dosage", label: "Dosage" },
        { key: "reason", label: "Reason/For:" },
        {
          key: "created_at",
          label: "Date",
          render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];
    const familyMedicalRecordColumn = [
        { key: "id", label: "ID", render: (_, row, index) => index !== undefined ? index + 1 : "N/A" },
        { key: "disease", label: "Desease" },
        { key: "relationship_disease", label: "Relationship" },
        {
          key: "created_at",
          label: "Date",
          render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientLayout>
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
                                                onClick={() => toggleMedicationModal(null,false,false)}
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
                                                onClick={() => toggleFamilyMedicalModal(null,false,false)}
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
                <FamilyMedicalRecordModal
                    showModal={showFamilyMedicalModal}
                    toggleFamilyMedicalModal={toggleFamilyMedicalModal}
                    selectedRecord={selectedFamilyMedicalRecord}
                    patient_id={patients[0]?.id}
                    patients={patients}
                    isEditing={!!selectedFamilyMedicalRecord}
                />
                <MedicationRecordModal
                    showModal={showMedicationModal}
                    toggleMedicationModal={toggleMedicationModal}
                    selectedMedication={selectedMedicationRecord}
                    patient_id={patients[0]?.id}
                    patients={patients}
                    medicines={medicines}
                    isEditing={!!selectedMedicationRecord}
                />

            </PatientLayout>
        </Suspense>
    );
}

export default History;