import React, { lazy } from 'react';

const PatientLayout = lazy(() => import("@/Layouts/PatientLayout"));
const Month = lazy(() => import("@/Components/Cards/Month"));

const BhwActivity = ({ barangayEvents }) => {
    const months = Object.keys(barangayEvents);

    const record = months.map(month => ({
        period: month,
        events: barangayEvents[month],
    }));

    return (
        <PatientLayout>
            <div className="p-4 md:p-8 relative">
                {record.map((monthData, idx) => (
                    <Month
                        key={idx}
                        period={monthData.period}
                        events={monthData.events}
                        top={idx * 30}
                    />
                ))}
            </div>
        </PatientLayout>
    );
};

export default BhwActivity;
