import React, { Suspense } from "react";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { LuClipboardEdit } from "react-icons/lu";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));
const Table = React.lazy(() => import("@/Components/Table"));

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
const testResultAction = [
  {
    label: "Edit",
    icon: LuClipboardEdit,
    onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
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
const immunizationAction = [
  {
    label: "Edit",
    icon: LuClipboardEdit,
    onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
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
    onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
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
const medicalRecordAction = [
  {
    label: "Edit",
    icon: LuClipboardEdit,
    onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
  },
];

const PatientRecord = ({ medicalRecords, hospitalizations, immunizations, testResults }) => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout>

        <Head title="Patient Record" />

        <div className='grid grid-cols-1 gap-6 mb-6'>
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">

          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Manage Patient Record</div>
          </div>

          <div className='p-4 bg-gray-200 rounded-lg mb-4'>
            <Accordion title='Test Result'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
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

          <div className='p-4 bg-gray-200 rounded-lg mb-4'>
            <Accordion title='Immunization Records'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
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
          
          <div className='p-4 bg-gray-200 rounded-lg mb-4'>
            <Accordion title='Hospitalization Records'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
                    <Table
                      columns={hospitalizationColumn}
                      data={hospitalizations}
                      actions={hospitalizationAction}
                      noDataMessage="No Immunization Available."
                    />
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

          <div className='p-4 bg-gray-200 rounded-lg'>
            <Accordion title='Personal Medical Records'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
                    <Table
                      columns={medicalRecordColumn}
                      data={medicalRecords}
                      actions={medicalRecordAction}
                      noDataMessage="No Medicine Record Available."
                    />
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

          </div>
        </div>

      </AdminLayout>
    </Suspense>
  )
}

export default PatientRecord
