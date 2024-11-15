import React, { useEffect, useRef, useState } from 'react'
import PatientLayout from '@/Layouts/PatientLayout'

const DataAnalysis = () => {

    const analysis = [
        {
            period: "SEPTEMBER 2024",
            firstHalf: {
                commonIlness: {
                    name: "COUGH",
                    percentage: 46
                },
                inDemandMedicine: {
                    name: "Paracetamol",
                    percentage: 46
                }
            },
            secondHalf: {}
        },
        {
            period: "OCTOBER 2024",
            firstHalf: {
                commonIlness: {
                    name: "COUGH",
                    percentage: 46
                },
                inDemandMedicine: {
                    name: "Paracetamol",
                    percentage: 46
                }
            },
            secondHalf: {}
        },
        {
            period: "NOVEMBER 2024",
            firstHalf: {
                commonIlness: {
                    name: "COUGH",
                    percentage: 46
                },
                inDemandMedicine: {
                    name: "Paracetamol",
                    percentage: 46
                }
            },
            secondHalf: {}
        }
    ]

    return (
        <PatientLayout>
            <div className='p-4 md:p-8 relative'>
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
                                    <span>1st Half:</span>
                                    <div className='px-8'>
                                        <span>Common Ilness: {anl.firstHalf.commonIlness.name} - </span>
                                        <span>{anl.firstHalf.commonIlness.percentage}%</span>
                                    </div>
                                    <div className='px-8'>
                                        <span>In Demand Medicine: {anl.firstHalf.inDemandMedicine.name} - </span>
                                        <span>{anl.firstHalf.inDemandMedicine.percentage}%</span>
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

export default DataAnalysis
