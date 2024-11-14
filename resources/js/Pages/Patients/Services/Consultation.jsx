import React, { lazy } from 'react';

const PatientLayout = lazy(() => import("@/Layouts/PatientLayout"));
const Month = lazy(() => import("@/Components/Cards/Month"));

const Consultation = ({ consultations }) => {
  
  const months = Object.keys(consultations);

  const record = months.map(month => ({
    period: month,
    events: consultations[month],
  }));

  return (
    <PatientLayout>
      <div className='p-8 relative'>
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
}

export default Consultation
