import React, { useState } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
import { format } from 'date-fns'; // Ensure you import format function from date-fns

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
        </PatientLayout>
    );
}

export default History;