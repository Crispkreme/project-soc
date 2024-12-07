import React, { Suspense, useState } from "react";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Table = React.lazy(() => import("@/Components/Table"));
const HealthHistoryModal = React.lazy(() => import("@/Components/Forms/HealthHistoryModal"));
const SurgicalHistoryModal = React.lazy(() => import("@/Components/Forms/SurgicalHistoryModal"));
const FamilyMedicalRecordModal = React.lazy(() => import("@/Components/Forms/FamilyMedicalRecordModal"));
const MedicationRecordModal = React.lazy(() => import("@/Components/Forms/MedicationRecordModal"));

import { Viewer, Worker } from '@react-pdf-viewer/core';

const PatientHistory = ({ medicines, patients, doctors, healthRecords, surgicalRecords, medicationRecords, familyMedicalRecords, patient_id }) => {
    const transformedDoctors = doctors.map(doctor => ({
        value: doctor.id,
        option: `${doctor.name}`
    }));

    const [showFamilyMedicalModal, setShowFamilyModal] = useState(false);
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [showHealthModal, setShowHealthModal] = useState(false);
    const [showSurgicalModal, setShowSurgicalModal] = useState(false);
    const [selectedFamilyMedicalRecord, setSelectedFamilyMedicalRecord] = useState(null);
    const [selectedMedicationRecord, setSelectedMedicationRecord] = useState(null);
    const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
    const [selectedSurgicalRecord, setSelectedSurgicalRecord] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    // HEALTH FUNCTIONALITY
    const toggleHealthModal = (healthRecord = null) => {
        setSelectedHealthRecord(healthRecord);
        setShowHealthModal(!!healthRecord || !showHealthModal);
    };
    const healthRecordColumn = [
        { key: "name", label: "Illness" },
        { key: "description", label: "Illness Description" },
        {
            key: "pdf_file",
            label: "Reports",
            render: (value) => (
                <button
                    className="text-blue-500 underline"
                    onClick={() => handleHealthPdfPreview(value)}
                >
                    Preview
                </button>
            ),
        },
        {
            key: "created_at",
            label: "Date",
            render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];
    const healthRecordAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => {
                toggleHealthModal(row);
            },
        },
    ];
    const handleHealthPdfPreview = (pdfPath) => {
        const fullPdfUrl = `http://localhost:8000/storage/${pdfPath}`;
        setSelectedPdf(fullPdfUrl);
        setShowPdfModal(true);
    };

    // FAMILY FUNCTIONALITY
    const toggleFamilyMedicalModal = (familyMedical = null) => {
        setSelectedFamilyMedicalRecord(familyMedical);
        setShowFamilyModal(!!familyMedical || !showFamilyMedicalModal);
    };
    const familyMedicalRecordColumn = [
        { key: "disease", label: "Desease" },
        { key: "relationship_disease", label: "Relationship" },
        {
            key: "pdf_file",
            label: "Reports",
            render: (value) => (
                <button
                    className="text-blue-500 underline"
                    onClick={() => handleFamilyMedicalPdfPreview(value)}
                >
                    Preview
                </button>
            ),
        },
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
          onClick: (row) => toggleFamilyMedicalModal(row, true, false, row.id),
        },
    ];
    const handleFamilyMedicalPdfPreview = (pdfPath) => {
        const fullPdfUrl = `http://localhost:8000/storage/${pdfPath}`;
        setSelectedPdf(fullPdfUrl);
        setShowPdfModal(true);
    };

    // SURGICAL FUNCTIONALITY
    const toggleSurgicalModal = (surgicalRecord = null) => {
        setSelectedSurgicalRecord(surgicalRecord);
        setShowSurgicalModal(!!surgicalRecord || !showSurgicalModal);
    };
    const surgicalRecordColumn = [
        { key: "procedure", label: "Surgery" },
        { key: "description", label: "Procedure" },
        { key: "doctor_name", label: "Doctor" },
        {
            key: "pdf_file",
            label: "Reports",
            render: (value) => (
                <button
                    className="text-blue-500 underline"
                    onClick={() => handleSurgicalPdfPreview(value)}
                >
                    Preview
                </button>
            ),
        },
        {
          key: "created_at",
          label: "Date",
          render: (value) => format(new Date(value), "MMMM d, yyyy"),
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
    const handleSurgicalPdfPreview = (pdfPath) => {
        const fullPdfUrl = `http://localhost:8000/storage/${pdfPath}`;
        setSelectedPdf(fullPdfUrl);
        setShowPdfModal(true);
    };

    // MEDICATION FUNCTIONALITY
    const toggleMedicationModal = (medication = null) => {
        setSelectedMedicationRecord(medication);
        setShowMedicationModal(!!medication || !showMedicationModal);
    };
    const medicationRecordAction = [
        {
          label: "Edit",
          icon: LuClipboardEdit,
          onClick: (row) => toggleMedicationModal(row, true, false, row.id),
        },
    ];
    const medicationRecordColumn = [
        { key: "medicine_name", label: "Medicine Name" },
        { key: "dosage", label: "Dosage" },
        { key: "reason", label: "Reason/For:" },
        {
            key: "pdf_file",
            label: "Reports",
            render: (value) => (
                <button
                    className="text-blue-500 underline"
                    onClick={() => handleMedicationPdfPreview(value)}
                >
                    Preview
                </button>
            ),
        },
        {
          key: "created_at",
          label: "Date",
          render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];
    const handleMedicationPdfPreview = (pdfPath) => {
        const fullPdfUrl = `http://localhost:8000/storage/${pdfPath}`;
        setSelectedPdf(fullPdfUrl);
        setShowPdfModal(true);
    };

    const closePdfModal = () => {
        setShowPdfModal(false);
        setSelectedPdf(null);
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
            </AdminLayout>

            <HealthHistoryModal
                showModal={showHealthModal}
                toggleHealthModal={toggleHealthModal} 
                selectedHealthRecord={selectedHealthRecord}
                patient_id={patient_id}
                patients={patients}
                isEditing={!!selectedHealthRecord}
            />

            <SurgicalHistoryModal
                showModal={showSurgicalModal}
                toggleSurgicalModal={toggleSurgicalModal}
                selectedSurgicalRecord={selectedSurgicalRecord}
                patient_id={patient_id}
                isEditing={!!selectedSurgicalRecord}
                doctors={transformedDoctors}
            />
            <FamilyMedicalRecordModal
                showModal={showFamilyMedicalModal}
                toggleFamilyMedicalModal={toggleFamilyMedicalModal}
                selectedRecord={selectedFamilyMedicalRecord}
                patient_id={patient_id}
                patients={patients}
                isEditing={!!selectedFamilyMedicalRecord}
            />
            <MedicationRecordModal
                showModal={showMedicationModal}
                toggleMedicationModal={toggleMedicationModal}
                selectedMedication={selectedMedicationRecord}
                patient_id={patient_id}
                patients={patients}
                medicines={medicines}
                isEditing={!!selectedMedicationRecord}
            />

            {showPdfModal && (
                <Modal
                    show={showPdfModal}
                    onClose={closePdfModal}
                    className="max-w-3xl mx-auto"
                >
                    {selectedPdf ? (
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Preview Pdf
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5 space-y-4">
                                <Viewer fileUrl={selectedPdf} />
                            </div>
                            <div className="flex items-center p-4 md:p-5">
                                <button data-modal-hide="default-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                <button data-modal-hide="default-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                            </div>
                        </Worker>
                    ) : (
                        <p>No PDF file available for preview.</p>
                    )}
                </Modal>
            )}

        </Suspense>
    );
};

export default PatientHistory;
