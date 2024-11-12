import React, { useEffect, useRef, useState } from 'react'
import PatientLayout from '@/Layouts/PatientLayout'

const Consultation = () => {

    const analysis = [
        {
            period: "SEPTEMBER 2024",
            consultations: [
              {day: 29, title: "Dental and General Consultation", doctor_name: "Victor Chiong"},
              {day: 23, title: "General Consultation", doctor_name: "Victor Chiong"},
            ]
        },
        {
            period: "OCTOBER 2024",
            consultations: [
              {day: 29, title: "Dental and General Consultation", doctor_name: "Victor Chiong"},
            ]
        },
        {
            period: "NOVEMBER 2024",
            consultations: []
        }
    ]

    return (
        <PatientLayout>
            <div className='p-8 relative'>
                {
                    analysis.map( (anl,idx) => {
                        
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
                            <section ref={ref} onClick={handleOnClick} key={idx} style={{top: `-${top}px`}} className={`${visible ? 'z-50' : 'z-0'} transition relative bg-white w-full border border-black rounded-xl`}>
                                <div className='header bg-secondary-bg py-2 px-4 rounded-t-xl'>
                                    {anl.period}
                                </div>
                                <div className='py-4 px-8 flex flex-col'>
                                    {
                                      anl.consultations.length > 0 ? (
                                        anl.consultations.map( (con,idx) => {
                                          return (
                                            <div className='flex justify-between items-center'>
                                              <div className='flex'>
                                                <span>{con.day} - {con.title}</span>
                                              </div>
                                              <div className='flex'>
                                                <span>Dr. {con.doctor_name}</span>
                                              </div>
                                            </div>
                                          )
                                        })
                                      ) : <span>No Consultations!</span>
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

export default Consultation
