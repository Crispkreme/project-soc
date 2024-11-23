import React, { useState } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
import { format } from 'date-fns';

const Sample = React.lazy(() => import("@/Components/Sample"));
const Table = React.lazy(() => import("@/Components/Table"));

const frequentlyAskQuestions = [
    {
      title: "SURGICAL HISTORY",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    },
    {
      title: "Why do we use it? ",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    },
    {
      title: "Where does it come from?",
      description:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
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
const healthRecordAction = [
    {
      label: "Edit",
      icon: LuClipboardEdit,
      onClick: (row) => toggleSurgicalModal(row, true, false, row.id),
    },
];

const History = ({ patient, healthRecords, surgicalRecords, medicationRecords, familyMedicalRecords }) => {
    const [visibleSections, setVisibleSections] = useState([]);

    const records = [
        {
            header: "SURGICAL HISTORY",
            data: surgicalRecords,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Procedure", accessor: "procedure" },
                { label: "Description", accessor: "description" },
                { label: "Doctor", accessor: "doctor_name" },
                {
                    label: "Date",
                    accessor: "created_at",
                    format: (date) => format(new Date(date), "MMMM d, yyyy"),
                },
            ],
        },
        {
            header: "HEALTH HISTORY",
            data: healthRecords,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Health Issue", accessor: "name" },
                { label: "Description", accessor: "description" },
                {
                    label: "Date",
                    accessor: "created_at",
                    format: (date) => format(new Date(date), "MMMM d, yyyy"),
                },
            ],
        },
        {
            header: "MEDICATION HISTORY",
            data: medicationRecords,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Medicine", accessor: "medicine.medicine_name" },
                { label: "Dosage", accessor: "dosage" },
                { label: "Reason", accessor: "reason" },
                {
                    label: "Date",
                    accessor: "created_at",
                    format: (date) => format(new Date(date), "MMMM d, yyyy"),
                },
            ],
        },
        {
            header: "FAMILY MEDICAL HISTORY",
            data: familyMedicalRecords,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Disease", accessor: "disease" },
                { label: "Relationship", accessor: "relationship_disease" },
            ],
        },
    ];

    const toggleVisibility = (idx) => {
        setVisibleSections((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 relative">
                {records.map((record, idx) => (
                    <section
                        key={idx}
                        className={`transition relative bg-white w-full border border-black rounded-xl ${
                            visibleSections.includes(idx) ? "z-50" : "z-0"
                        }`}
                    >
                        <div
                            onClick={() => toggleVisibility(idx)}
                            className="header bg-secondary-bg py-2 px-4 rounded-t-xl cursor-pointer"
                        >
                            {record.header}
                        </div>
                        {visibleSections.includes(idx) && (
                            <div className="py-4 px-8 flex flex-col">
                                <table className="w-full min-w-[540px]">
                                    <thead>
                                        <tr>
                                            {record.columns.map((col, colIdx) => (
                                                <th
                                                    key={colIdx}
                                                    className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left"
                                                >
                                                    {col.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {record.data && record.data.length > 0 ? (
                                            record.data.map((item, rowIdx) => (
                                                <tr key={rowIdx}>
                                                    {record.columns.map((col, colIdx) => (
                                                        <td
                                                            key={colIdx}
                                                            className="py-2 px-4 border-b border-b-gray-50"
                                                        >
                                                            <span className="text-[13px] font-medium text-gray-400">
                                                                {col.render
                                                                    ? col.render(item, rowIdx)
                                                                    : col.format
                                                                    ? col.format(item[col.accessor])
                                                                    : col.accessor.includes(".")
                                                                    ? col.accessor
                                                                          .split(".")
                                                                          .reduce(
                                                                              (obj, key) => obj?.[key],
                                                                              item
                                                                          )
                                                                    : item[col.accessor] || 'N/A'}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={record.columns.length}
                                                    className="text-center py-4 text-gray-500"
                                                >
                                                    No {record.header.toLowerCase()} available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                ))}
            </div>

            <Sample questions={frequentlyAskQuestions} />

            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-medium">
                            Manage Health History
                        </h2>
                        <button
                            type="button"
                            className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                            onClick={() => toggleHealthModal(null,false,false)}
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

        </PatientLayout>
    );
}

export default History;