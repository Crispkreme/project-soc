import React, { useState } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';

const Analytics = ({ dataAnalytic }) => {
  const [visibleSection, setVisibleSection] = useState(null);

  const toggleVisibility = (index) => {
    setVisibleSection(visibleSection === index ? null : index);
  };

  return (
    <PatientLayout>
      <div className="p-4 md:p-8 relative">
        {Object.entries(dataAnalytic).map(([month, records], idx) => {
          const isVisible = visibleSection === idx;

          // Group illnesses and medicines
          const illnesses = [...new Set(records.map((record) => record.illness))];
          const medicines = records.reduce((acc, record) => {
            acc[record.medicine] = (acc[record.medicine] || 0) + record.total_quantity;
            return acc;
          }, {});

          return (
            <section
              key={idx}
              className={`${
                isVisible ? 'z-50' : 'z-0'
              } transition relative bg-white w-full border border-black rounded-xl mb-4`}
            >
              <div
                onClick={() => toggleVisibility(idx)}
                className="header bg-secondary-bg py-2 px-4 rounded-t-xl cursor-pointer"
              >
                {month}
              </div>
              {isVisible && (
                <div className="py-4 px-8 flex flex-col">
                  {/* Illnesses */}
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Illnesses:</h4>
                    {illnesses.length > 0 ? (
                      illnesses.map((illness, illnessIdx) => (
                        <span key={illnessIdx} className="block">
                          {illness}
                        </span>
                      ))
                    ) : (
                      <span>No illnesses recorded this month.</span>
                    )}
                  </div>

                  {/* Medicines */}
                  <div>
                    <h4 className="font-bold mb-2">Medicines:</h4>
                    {Object.keys(medicines).length > 0 ? (
                      Object.entries(medicines).map(([medicine, total], medicineIdx) => (
                        <span key={medicineIdx} className="block">
                          {medicine} - {total}
                        </span>
                      ))
                    ) : (
                      <span>No medicines recorded this month.</span>
                    )}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </PatientLayout>
  );
};

export default Analytics;
