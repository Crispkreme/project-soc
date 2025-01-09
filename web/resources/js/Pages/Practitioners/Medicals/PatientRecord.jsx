import React, { Suspense, useState } from "react";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { LuClipboardEdit } from "react-icons/lu";
import { HiOutlinePlusSm } from "react-icons/hi";

import { Viewer, Worker } from "@react-pdf-viewer/core";

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const Table = React.lazy(() => import("@/Components/Table"));
const HospitalizationModal = React.lazy(() => import("@/Components/Forms/HospitalizationModal"));
const ImmunizationModal = React.lazy(() => import("@/Components/Forms/ImmunizationModal"));
const MedicalRecordModal = React.lazy(() => import("@/Components/Forms/MedicalRecordModal"));
const TestResultModal = React.lazy(() => import("@/Components/Forms/TestResultModal"));

const PatientRecord = ({ hospitals, medicines, patients, doctors, medicalRecords, hospitalizations, immunizations, testResults }) => {
    console.log("immunizations", immunizations);
    const [showTestResultModal, setShowTestResultModal] = useState(false);
    const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
    const [showImmunizationModal, setShowImmunizationModal] = useState(false);
    const [showHospitalizationModal, setShowHospitalizationModal] = useState(false);
    const [selectedTestResult, setSelectedTestResult] = useState(null);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);
    const [selectedImmunization, setSelectedImmunization] = useState(null);
    const [selectedHospitalization, setSelectedHospitalization] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const closePdfModal = () => {
        setShowPdfModal(false);
        setSelectedPdf(null);
    };

    // TEST RESULT FUNCTIONALITY
    const toggleTestResultModal = (testResult = null) => {
        setSelectedTestResult(testResult);
        setShowTestResultModal(!!testResult || !showTestResultModal);
    };
    const testResultColumn = [
        { key: "name", label: "Test" },
        { key: "result", label: "Result" },
        {
          key: "pdf_file",
          label: "Reports",
          render: (value) => (
            <button
              className="text-blue-500 underline"
              onClick={() => handleTestResultPdfPreview(value)}
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
    const testResultAction = [
        {
          label: "Edit",
          icon: LuClipboardEdit,
          onClick: (row) => toggleTestResultModal(row),
        },
    ];
    const handleTestResultPdfPreview = (pdfPath) => {
        const baseUrl = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage/";
        const fullPdfUrl = `${baseUrl}${pdfPath}`;
        setSelectedPdf(fullPdfUrl);
        setShowPdfModal(true);
    };

    // IMMUNIZATION FUNCTIONALITY
    const toggleImmunizationModal = (immunization = null) => {
        setSelectedImmunization(immunization);
        setShowImmunizationModal(!!immunization || !showImmunizationModal);
    };
    const immunizationColumn = [
        { key: "immunization", label: "Immunization" },
        { key: "doctor_name", label: "Doctor" },
        {
            key: "pdf_file",
            label: "Reports",
            render: (value) => (
              <button
                className="text-blue-500 underline"
                onClick={() => handleImmunizationPdfPreview(value)}
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
    const immunizationAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => toggleImmunizationModal(row, true, false, row.id),
        },
    ];
    const handleImmunizationPdfPreview = (pdfPath) => {
        const baseUrl = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage/";
        const fullPdfUrl = `${baseUrl}${pdfPath}`;
        setSelectedPdf(fullPdfUrl);
        setShowPdfModal(true);
    };

    const toggleMedicalRecordModal = (medicalRecord = null) => {
        setSelectedMedicalRecord(medicalRecord);
        setShowMedicalRecordModal((prev) => !prev);
    };
    const toggleHospitalizationModal = (hospitalization = null) => {
        setSelectedHospitalization(hospitalization);
        setShowHospitalizationModal((prev) => !prev);
    };

    const medicalRecordColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "diagnosis", label: "Diagnosis" },
        { key: "medicine.medicine_name", label: "Medication" },
        {
            key: "created_at",
            label: "Date",
            render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];
    
    const hospitalizationColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "diagnosis", label: "Diagnosis" },
        { key: "hospital_name", label: "Hospital" },
        { key: "doctor_name", label: "Doctor" },
        {
            key: "created_at",
            label: "Date",
            render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];

    
    const hospitalizationAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) =>
                toggleHospitalizationModal(row, true, false, row.id),
        },
    ];

    const medicalRecordAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) =>
                toggleMedicalRecordModal(row, true, false, row.id),
        },
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientLayout>
                <Head title="Patient Record" />

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">
                                Manage Patient Record
                            </div>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Test Result">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="font-medium">
                                                    Manage Test Result
                                                </h2>
                                                <button
                                                    type="button"
                                                    className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                    onClick={() => toggleTestResultModal(null)}
                                                >
                                                <HiOutlinePlusSm className="mr-1" /> Add Test Result
                                                </button>
                                            </div>
                                            <Table
                                                columns={testResultColumn}
                                                data={testResults}
                                                actions={testResultAction}
                                                noDataMessage="No Test Results Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Immunization Records">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="font-medium">
                                                    Manage Immunization Records
                                                </h2>
                                                <button
                                                    type="button"
                                                    className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                    onClick={() =>
                                                        toggleImmunizationModal(
                                                            null
                                                        )
                                                    }
                                                >
                                                    <HiOutlinePlusSm className="mr-1" />{" "}
                                                    Add Immunization Record
                                                </button>
                                            </div>
                                            <Table
                                                columns={immunizationColumn}
                                                data={immunizations}
                                                actions={immunizationAction}
                                                noDataMessage="No Immunization Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg mb-4">
                            <Accordion title="Hospitalization Records">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="font-medium">
                                                    Manage Hospitalization
                                                    Records
                                                </h2>
                                                <button
                                                    type="button"
                                                    className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                    onClick={() =>
                                                        toggleHospitalizationModal(
                                                            null
                                                        )
                                                    }
                                                >
                                                    <HiOutlinePlusSm className="mr-1" />{" "}
                                                    Add Hospitalization Records
                                                </button>
                                            </div>
                                            <Table
                                                columns={hospitalizationColumn}
                                                data={hospitalizations}
                                                actions={hospitalizationAction}
                                                noDataMessage="No Hospitalization Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>

                        <div className="p-4 bg-gray-200 rounded-lg">
                            <Accordion title="Personal Medical Records">
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                                        <div className="overflow-x-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="font-medium">
                                                    Manage Personal Medical
                                                    Records
                                                </h2>
                                                <button
                                                    type="button"
                                                    className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                    onClick={() =>
                                                        toggleMedicalRecordModal(
                                                            null
                                                        )
                                                    }
                                                >
                                                    <HiOutlinePlusSm className="mr-1" />{" "}
                                                    Add Personal Medical Records
                                                </button>
                                            </div>
                                            <Table
                                                columns={medicalRecordColumn}
                                                data={medicalRecords}
                                                actions={medicalRecordAction}
                                                noDataMessage="No Medical Record Available."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </PatientLayout>

            <HospitalizationModal
                showModal={showHospitalizationModal}
                toggleHospitalizationModal={toggleHospitalizationModal}
                selectedHospitalization={selectedHospitalization}
                patient_id={patients[0]?.id}
                patients={patients}
                doctors={doctors}
                hospitals={hospitals}
                isEditing={!!selectedHospitalization}
            />
            <ImmunizationModal
                showModal={showImmunizationModal}
                toggleImmunizationModal={toggleImmunizationModal}
                selectedImmunization={selectedImmunization}
                patient_id={patients[0]?.id}
                doctors={doctors}
                isEditing={!!selectedImmunization}
            />
            <MedicalRecordModal
                showModal={showMedicalRecordModal}
                toggleMedicalRecordModal={toggleMedicalRecordModal}
                selectedMedicalRecord={selectedMedicalRecord}
                patient_id={patients[0]?.id}
                patients={patients}
                medicines={medicines}
                isEditing={!!selectedMedicalRecord}
            />
            <TestResultModal
                showModal={showTestResultModal}
                toggleTestResultModal={toggleTestResultModal}
                selectedTestResult={selectedTestResult}
                patient_id={patients[0]?.id}
                patients={patients}
                isEditing={!!selectedTestResult}
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
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="default-modal"
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                      <Viewer fileUrl={selectedPdf} />
                    </div>
                    <div className="flex items-center p-4 md:p-5">
                      <button
                        data-modal-hide="default-modal"
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        I accept
                      </button>
                      <button
                        data-modal-hide="default-modal"
                        type="button"
                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Decline
                      </button>
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

export default PatientRecord;
