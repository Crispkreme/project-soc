import React from "react";
import { format } from 'date-fns';
import { LuClipboardEdit } from 'react-icons/lu';

const Table = React.lazy(() => import("@/Components/Table"));

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

const healthRecordAction = [
  {
    label: "Edit",
    icon: LuClipboardEdit,
    onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
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

const surgicalRecordAction = [
  {
    label: "Edit",
    icon: LuClipboardEdit,
    onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
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
  { key: "disease", label: "Disease" },
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

const patientHistory = [
  {
    title: "Manage Health History",
    tableData: {
      columns: healthRecordColumn,
      data: [
        { id: 1, name: "Flu", description: "Common cold symptoms", created_at: "2024-01-01" },
        { id: 2, name: "Diabetes", description: "High blood sugar", created_at: "2024-02-15" },
      ],
      actions: healthRecordAction,
    },
  },
  {
    title: "Manage Surgical History",
    tableData: {
      columns: surgicalRecordColumn,
      data: [
        { id: 1, procedure: "Appendectomy", description: "Appendix removal", doctor_name: "Dr. Smith", created_at: "2024-01-01" },
        { id: 2, procedure: "Gallbladder Surgery", description: "Gallbladder removal", doctor_name: "Dr. Lee", created_at: "2024-02-15" },
      ],
      actions: surgicalRecordAction,
    },
  },
  {
    title: "Family Medical History",
    tableData: {
      columns: familyMedicalRecordColumn,
      data: [
        { id: 1, disease: "Cancer", relationship_disease: "Mother", created_at: "2024-01-01" },
        { id: 2, disease: "Heart Disease", relationship_disease: "Father", created_at: "2024-02-15" },
      ],
      actions: familyMedicalRecordAction,
    },
  },
];

export default function AccordionWithTables() {
  return (
    <div className="accordion-group" data-accordion="default-accordion">
      {patientHistory.map((section, index) => (
        <div
          key={index}
          className="accordion border border-solid border-gray-300 p-4 rounded-xl transition duration-500 accordion-active:bg-indigo-50 accordion-active:border-indigo-600 mb-8 lg:p-4"
          id={`basic-heading-${index}-with-icon`}
        >
          <button
            className="accordion-toggle group inline-flex items-center justify-between text-left text-base leading-8 text-gray-900 w-full transition duration-500 hover:text-indigo-600 accordion-active:text-indigo-600"
            aria-controls={`basic-collapse-${index}-with-icon`}
          >
            <h5>{section.title}</h5>
            <svg
              className="w-6 h-6 text-gray-900 transition duration-500 block accordion-active:text-indigo-600 accordion-active:hidden group-hover:text-indigo-600 origin-center"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18M12 18V6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <svg
              className="w-6 h-6 text-gray-900 transition duration-500 hidden accordion-active:text-indigo-600 accordion-active:block group-hover:text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12H18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <div
            id={`basic-collapse-${index}-with-icon`}
            className="accordion-content w-full overflow-hidden pr-4"
            aria-labelledby={`basic-heading-${index}`}
          >
            <p className="text-base text-gray-900 leading-6">
              <Table
                columns={section.tableData.columns}
                data={section.tableData.data}
                actions={section.tableData.actions}
                noDataMessage={`No ${section.title.split(" ")[1]} Available.`}
              />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

