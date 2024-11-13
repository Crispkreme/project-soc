import React from 'react'
import PatientLayout from '@/Layouts/PatientLayout'

const Bhw = () => {
  const data = {
    patients: 154,
    practitioners: 4,
    bhw: [
      {bhw_name: "Victor Chiong", image: 'https://cdn-icons-png.freepik.com/512/700/700674.png'},
      {bhw_name: "John Doe", image: 'https://cdn-icons-png.freepik.com/512/700/700674.png'},
      {bhw_name: "Jane Doe", image: 'https://cdn-icons-png.freepik.com/512/700/700674.png'},
      {bhw_name: "Mark Logan", image: 'https://cdn-icons-png.freepik.com/512/700/700674.png'},
    ]
  }
  return (
    <PatientLayout>
      <div className='p-8'>
        <div className='w-full flex justify-around px-4 py-2 items-center bg-secondary-bg rounded-full border-2 border-black'>
          <div className='flex gap-2 items-center'>
            <span className='text-lg'>Patients</span>
            <span className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-black'>{data.patients}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className='text-lg'>Practitioners</span>
            <span className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-black'>{data.practitioners}</span>
          </div>
          <div className='flex gap-2 items-center'>
            <span className='text-lg'>BHW</span>
            <span className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-black'>{data.bhw.length}</span>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {
            data.bhw.map( (p, i) => {
              return (
                <div key={i} className='p-8'>
                  <div className='border border-black flex items-center gap-4 rounded-2xl'>
                    <img src={p.image} className='w-32 h-32 bg-secondary-bg rounded-l-2xl'/>
                    <div className='flex flex-col'>
                      <span className='text-xl font-semibold'>{p.bhw_name}</span>
                      <span className='text-sm'>BHW</span>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </PatientLayout>
  )
}

export default Bhw
