import React, { useEffect, useRef, useState } from 'react'
import PatientLayout from '@/Layouts/PatientLayout'

const History = () => {

    const record = [
        {
            header: "SURGICAL HISTORY",
        },
        {
            header: "HEALTH HISTORY",
        },
        {
            header: "MEDICATION HISTORY",
        },
        {
            header: "FAMILY MEDICAL HISTORY",
        }
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
                                  {anl.header}
                              </div>
                              <div className='py-4 px-8 flex flex-col h-16'>
                                  
                              </div>
                          </section>
                      )
                    })
                }
            </div>
        </PatientLayout>
    );
}

export default History