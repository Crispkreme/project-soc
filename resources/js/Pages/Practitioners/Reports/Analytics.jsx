import React, { useEffect, useRef, useState } from 'react'
import PatientLayout from '@/Layouts/PatientLayout'

const Analytics = () => {

    const record = [
        {
          period: "SEPTEMBER 2024",
          firstHalf: null,
          secondHalf: null
        },
        {
          period: "OCTOBER 2024",
          firstHalf: {
            commonIlness: "COUGH",
            percent: 46,
            indemandMedecine: "Paracetamol",
            mPercent: 46
          },
          secondHalf: {
            commonIlness: "COUGH",
            percent: 46,
            indemandMedecine: "Paracetamol",
            mPercent: 46
          }
        },
        {
          period: "NOVEMBER 2024",
          firstHalf: {
            commonIlness: "COUGH",
            cPercent: 46,
            indemandMedecine: "Paracetamol",
            mPercent: 46
          },
          secondHalf: null
        },
    ]

    return (
        <PatientLayout>
            <div className='p-4 md:p-8 relative'>
                {
                    record.map( (anl,idx) => {
                        
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
                                    <div className='flex flex-col'>
                                      {!anl.firstHalf && !anl.secondHalf && <span>No Records this month!</span>}
                                      { anl.firstHalf && (
                                        <>
                                        <span>1st Half</span>
                                        {anl.firstHalf && <span className='px-8'>Common Ilness: {anl.firstHalf.commonIlness} - {anl.firstHalf.cPercent}</span>}
                                        {anl.firstHalf && <span className='px-8'>In Demand Medicine: {anl.firstHalf.indemandMedecine} - {anl.firstHalf.mPercent}</span>}
                                        </>
                                      )}
                                      { anl.secondHalf && (
                                        <>
                                        <span>2nd Half</span>
                                        {anl.secondHalf && <span className='px-8'>Common Ilness: {anl.secondHalf.commonIlness} - {anl.secondHalf.cPercent}</span>}
                                        {anl.secondHalf && <span className='px-8'>In Demand Medicine: {anl.secondHalf.indemandMedecine} - {anl.secondHalf.mPercent}</span>}
                                        </>
                                      )}
                                    </div>
                                </div>
                            </section>
                        )
                    })
                }
            </div>
        </PatientLayout>
    );
}

export default Analytics
