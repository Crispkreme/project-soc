import React, { lazy } from 'react';

const UserDetail = lazy(() => import("@/Components/Cards/UserDetail"));
const PatientLayout = lazy(() => import("@/Layouts/PatientLayout"));

const Bhw = ({ totalBhw, totalPatient, totalPractitioner, patients}) => {

  return (
    <PatientLayout>
      <div className='lg:p-8'>
        <div className='w-full flex justify-around py-2 items-center bg-secondary-bg rounded-full border-2 border-black'>
          <div className='flex flex-col lg:flex-row px-4 gap-2 items-center'>
            <span className='text-sm lg:text-lg'>Patients</span>
            <span className='flex justify-center items-center lg:w-10 lg:h-10 w-6 h-6 rounded-full border-2 border-black'>{totalPatient}</span>
          </div>
          <div className='flex flex-col lg:flex-row px-4 gap-2 items-center'>
            <span className='text-sm lg:text-lg'>Practitioners</span>
            <span className='flex justify-center items-center lg:w-10 lg:h-10 w-6 h-6 rounded-full border-2 border-black'>{totalPractitioner}</span>
          </div>
          <div className='flex flex-col lg:flex-row px-4 gap-2 items-center'>
            <span className='text-sm lg:text-lg'>BHW</span>
            <span className='flex justify-center items-center lg:w-10 lg:h-10 w-6 h-6 rounded-full border-2 border-black'>{totalBhw}</span>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {patients.length > 0 ? (
            patients.map((bhw) => (
              <UserDetail key={bhw.id} userDetail={bhw} />
            ))
          ) : (
            <div>No Available Patient</div>
          )}
        </div>
      </div>
    </PatientLayout>
  )
}

export default Bhw
