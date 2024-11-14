import React, { lazy } from 'react';

const UserDetail = lazy(() => import("@/Components/Cards/UserDetail"));
const PatientLayout = lazy(() => import("@/Layouts/PatientLayout"));

const Bhw = ({ totalBhw, totalPatient, totalPractitioner, bhws}) => {

  return (
    <PatientLayout>
      <div className='p-8'>
        <div className='w-full flex justify-around px-4 py-2 items-center bg-secondary-bg rounded-full border-2 border-black'>
          <div className='flex gap-2 items-center'>
            <span className='text-lg'>Patients</span>
            <span className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-black'>{totalPatient}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className='text-lg'>Practitioners</span>
            <span className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-black'>{totalPractitioner}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className='text-lg'>BHW</span>
            <span className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-black'>{totalBhw}</span>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {bhws.length > 0 ? (
            bhws.map((bhw) => (
              <UserDetail key={bhw.id} userDetail={bhw} />
            ))
          ) : (
            <div>No Available Bhw</div>
          )}
        </div>
      </div>
    </PatientLayout>
  )
}

export default Bhw
