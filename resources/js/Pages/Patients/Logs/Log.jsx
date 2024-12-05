import React, { useState, Suspense, useEffect } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
import Table from "@/Components/Table";

const Log = ({ logs }) => {
    console.log(logs);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLog, setFilteredLog] = useState(logs);

    useEffect(() => {
        setFilteredLog(logs);
    }, [logs]);

    const formatDate = (date) => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    const logColumn = [
        { key: "id", label: "ID", render: (_, __, index) => index + 1 },
        {
            key: "doctor_name",
            label: "Name",
            render: (value, row) => row.doctor_name || row.patient_name || "N/A",
        },
        { key: "message", label: "Message" },
        { key: "log_status", label: "Status" },
        { key: "created_at", label: "Created At", render: (date) => formatDate(date) },
    ];    

    const handleSearch = (e) => {
        const query = e.target.value.trim();
        setSearchQuery(query);

        const filtered = logs.filter((log) =>
            (log.message || "").toLowerCase().includes(query.toLowerCase()) ||
            (log.log_status || "").toLowerCase().includes(query.toLowerCase())
        );

        setFilteredLog(filtered);
    };

    return (
        <PatientLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                    <div className="pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="table-search"
                                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search for logs"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <Table
                            columns={logColumn}
                            data={filteredLog}
                            noDataMessage="No Logs Available."
                        />
                    </div>
                </div>
            </Suspense>
        </PatientLayout>
    );
};

export default Log;
