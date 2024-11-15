import React, { useEffect, useRef, useState } from 'react'
import PatientLayout from '@/Layouts/PatientLayout'
import { FaEye } from 'react-icons/fa';

const Released = () => {

    const appointments = [
        {
          period: "SEPTEMBER 2024",
          schedules: [
            {day: 23, title: "Prescription", patient: "Victor Chiong"},
            {day: 25, title: "Notification", patient: "Victor Chiong"},
          ]
        },
        {
          period: "OCTOBER 2024",
          schedules: []
        },
        {
          period: "NOVEMBER 2024",
          schedules: [
            {day: 25, title: "Prescription", patient: "Victor Chiong"},
            {day: 25, title: "Referral", patient: "Victor Chiong"},
            {day: 29, title: "Notification", patient: "Victor Chiong"},
          ]
        },
    ]

    return (
        <PatientLayout>
            <div className='p-4 md:p-8 relative'>
                {
                    appointments.map( (app,idx) => {
                        
                      const top = idx * 30;
                        const ref = useRef(null);
                        const [visible, setVisible] = useState(false);
                        const handleOnClick = () => setVisible(!visible);

                        useEffect(() => {
                            function handleClickOutside(event) {
                              if (ref.current && !ref.current.contains(event.target)) {
                                setVisible(false);
                              }
                            }

                            document.addEventListener("mouseup", handleClickOutside);
                            return () => {
                              document.removeEventListener("mouseup", handleClickOutside);
                            };
                          }, [ref]);
                        

                        return (
                            <section ref={ref} onClick={handleOnClick} key={idx} style={{top: `-${top}px`}} className={`${visible ? 'z-50' : 'z-0'} transition relative max-h-max bg-white w-full border border-black rounded-xl`}>
                                <div className='header bg-secondary-bg py-2 px-4 rounded-t-xl'>
                                    {app.period}
                                </div>
                                <div className='py-4 px-8 flex flex-col'>
                                    {
                                      app.schedules.length > 0 ? (
                                        app.schedules.map( (x, i) => {
                                          return (
                                            <div className='flex items-center gap-4' key={i}>
                                              <span className='text-sm '>{x.day} - {x.title} - {x.patient} </span>
                                              <FaEye />
                                            </div>
                                          )
                                        })
                                      ) : <span>There is no released patients!</span>
                                    }
                                </div>
                            </section>
                        )
                    })
                }
            </div>
        </PatientLayout>
    );
}

export default Released
