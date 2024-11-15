import React, { useEffect, useRef, useState } from 'react'
import PatientLayout from '@/Layouts/PatientLayout'

const Appointment = () => {

    const appointments = [
        {
          period: "SEPTEMBER 2024",
          schedules: [
            {day: 23, title: "Dental and General Consultation", doctor: "Victor Chiong"},
            {day: 25, title: "General Consultation", doctor: "Victor Chiong"},
          ]
        },
        {
          period: "OCTOBER 2024",
          schedules: []
        },
        {
          period: "NOVEMBER 2024",
          schedules: [
            {day: 25, title: "General Consultation", doctor: "Victor Chiong"},
            {day: 25, title: "General Consultation", doctor: "Victor Chiong"},
            {day: 29, title: "Dental and General Consultation", doctor: "Victor Chiong"},
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
                                            <div key={i}>
                                              <span className='text-sm'>{x.day} - {x.title} - Dr.{x.doctor}</span>
                                            </div>
                                          )
                                        })
                                      ) : <span>There is no schedule!</span>
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

export default Appointment
