import React from 'react';
import PatientLayout from '@/Layouts/PatientLayout';

const Medicine = () => {

  const medicines = [
    {medicine: "Paracetamol Biogesic", dosage: "500mg", available: {packs: 2, pieces: 200}},
    {medicine: "Paracetamol Biogesic", dosage: "500mg", available: {packs: 2, pieces: 200}},
    {medicine: "Paracetamol Biogesic", dosage: "500mg", available: {packs: 2, pieces: 200}},
  ]
  return (
    <PatientLayout>
      <div className='p-8'>
        <div className='border border-black rounded-xl '>
          <section className='p-4 border-b border-black grid grid-cols-3 bg-secondary-bg rounded-t-xl'>
            <div>
              <span>Medicine</span>
            </div>
            <div>
              <span>Dosage</span>
            </div>
            <div>
              <span>Available</span>
            </div>
          </section>
          <section>
            {
              medicines.map( (med, idx) => {
                return (
                  <div className='grid grid-cols-3 p-4' key={idx}>
                    <span>{med.medicine}</span>
                    <span>{med.dosage}</span>
                    <span>{`${med.available.packs > 0 ? `${med.available.packs} packs`:''}, ${med.available.pieces > 0 ? `${med.available.pieces} pieces`:''}`}</span>
                  </div>
                )
              })
            }
          </section>
        </div>
      </div>
    </PatientLayout>
  )
}

export default Medicine
