import React, { useState } from "react";
import PatientLayout from "@/Layouts/PatientLayout";
import { format } from "date-fns";

const Medical = ({ medicalRecords, hospitalizations, immunizations, testResults, patient }) => {
    const [visibleSections, setVisibleSections] = useState([]);

    const toggleVisibility = (idx) => {
        setVisibleSections((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    const records = [
        {
            header: "TEST RESULTS",
            data: testResults,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Test", accessor: "name" },
                { label: "Result", accessor: "result" },
                { label: "Date", accessor: "created_at", format: (date) => format(new Date(date), "MMMM d, yyyy") },
            ],
        },
        {
            header: "IMMUNIZATION RECORDS",
            data: immunizations,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Immunization", accessor: "immunization" },
                { label: "Doctor", accessor: "doctor_name" },
                { label: "Date", accessor: "created_at", format: (date) => format(new Date(date), "MMMM d, yyyy") },
            ],
        },
        {
            header: "HOSPITALIZATION RECORDS",
            data: hospitalizations,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Diagnosis", accessor: "diagnosis" },
                { label: "Hospital", accessor: "hospital_name" },
                { label: "Doctor", accessor: "doctor_name" },
                { label: "Date", accessor: "created_at", format: (date) => format(new Date(date), "MMMM d, yyyy") },
            ],
        },
        {
            header: "PERSONAL RECORDS",
            data: medicalRecords,
            columns: [
                { label: "ID", render: (_, idx) => idx + 1 },
                { label: "Diagnosis", accessor: "diagnosis" },
                { label: "Medication", accessor: "medicine.medicine_name" },
                { label: "Date", accessor: "created_at", format: (date) => format(new Date(date), "MMMM d, yyyy") },
            ],
        },
    ];

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
                                        {record.data.length > 0 ? (
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
                                                                    : item[col.accessor]}
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
};

export default Medical;
