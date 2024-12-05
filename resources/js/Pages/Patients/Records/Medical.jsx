import React, { useState, Suspense } from "react";
import { format } from "date-fns";
import { LuClipboardEdit } from "react-icons/lu";
import { HiOutlinePlusSm } from "react-icons/hi";

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const Table = React.lazy(() => import("@/Components/Table"));

const HospitalizationModal = React.lazy(() =>
    import("@/Components/Forms/HospitalizationModal")
);
const ImmunizationModal = React.lazy(() =>
    import("@/Components/Forms/ImmunizationModal")
);
const MedicalRecordModal = React.lazy(() =>
    import("@/Components/Forms/MedicalRecordModal")
);
const TestResultModal = React.lazy(() =>
    import("@/Components/Forms/TestResultModal")
);

const Medical = ({
    hospitals,
    medicines,
    patients,
    doctors,
    medicalRecords,
    hospitalizations,
    immunizations,
    testResults,
}) => {
    const [showTestResultModal, setShowTestResultModal] = useState(false);
    const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
    const [showImmunizationModal, setShowImmunizationModal] = useState(false);
    const [showHospitalizationModal, setShowHospitalizationModal] =
        useState(false);

    const [selectedTestResult, setSelectedTestResult] = useState(null);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);
    const [selectedImmunization, setSelectedImmunization] = useState(null);
    const [selectedHospitalization, setSelectedHospitalization] =
        useState(null);

    const toggleTestResultModal = (testResult = null) => {
        setSelectedTestResult(testResult);
        setShowTestResultModal((prev) => !prev);
    };
    const toggleMedicalRecordModal = (medicalRecord = null) => {
        setSelectedMedicalRecord(medicalRecord);
        setShowMedicalRecordModal((prev) => !prev);
    };
    const toggleImmunizationModal = (immunization = null) => {
        setSelectedImmunization(immunization);
        setShowImmunizationModal((prev) => !prev);
    };
    const toggleHospitalizationModal = (hospitalization = null) => {
        setSelectedHospitalization(hospitalization);
        setShowHospitalizationModal((prev) => !prev);
    };

    const testResultColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "name", label: "Test" },
        { key: "result", label: "Result" },
        {
            key: "created_at",
            label: "Date",
            render: (value) => format(new Date(value), "MMMM d, yyyy"),
        },
    ];
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
    const immunizationColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        { key: "immunization", label: "Immunization" },
        { key: "doctor_name", label: "Doctor" },
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

    const immunizationAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => toggleImmunizationModal(row, true, false, row.id),
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

    const testResultAction = [
        {
            label: "Edit",
            icon: LuClipboardEdit,
            onClick: (row) => toggleTestResultModal(row, true, false, row.id),
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
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Patient Record</div>
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
                                                    onClick={() =>
                                                        toggleTestResultModal(null)
                                                    }
                                                >
                                                    <HiOutlinePlusSm className="mr-1" />{" "}
                                                    Add Test Result
                                                </button>
                                            </div>
                                            <Table
                                                columns={testResultColumn}
                                                data={testResults}
                                                actions={testResultAction}
                                                noDataMessage="No Test Result Available."
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
                                                    Manage Hospitalization Records
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
                                                    Manage Personal Medical Records
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
            </PatientLayout>
        </Suspense>
    );
};

export default Medical;
