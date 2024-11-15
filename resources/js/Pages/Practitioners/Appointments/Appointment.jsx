import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const AppointmentModal = React.lazy(() => import("./AppointmentModal"));

const Appointment = ({ barangayEvents, doctors }) => {

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const bookings = [{
    title: 'General Consultation',
    notes: 'Sample Descriptions',
    appointment_date: '2024-11-11',
    doctor_name: 'Victor Chiong',
    patient_name: 'Victor Wawa',
    appointment_start: '09:00:00.000Z',
    appointment_end: '05:00:00.000Z',
    booking_status: 'Success',
  },{
    title: 'Dentism',
    notes: 'Sample Descriptions',
    appointment_date: '2024-11-15',
    doctor_name: 'Victor Chiong',
    patient_name: 'Victor Wawa',
    appointment_start: '09:00:00.000Z',
    appointment_end: '05:00:00.000Z',
    booking_status: 'Pending',
  }];

  const futureSchedules = [
    {period: "September 2024", schedule: []},
    {period: "October 2024", schedule: []},
    {period: "November 2024", schedule: [
      {appointment_date: '2024-11-15', title: 'General Consultation', doctor: 'Victor Chiong'},
      {appointment_date: '2024-11-14', title: 'General Consultation', doctor: 'Victor Chiong'},
    ]},
  ]

  const completedBookings = bookings.filter( booking => booking.booking_status === "Success");
  const latestFinishedBookings = completedBookings.length > 0 ? completedBookings[completedBookings.length - 1] : null;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
    
  const bookingSchedule = bookings.map(booking => {
    const startTime = `${booking.appointment_date}T${booking.appointment_start}`;
    const endTime = `${booking.appointment_date}T${booking.appointment_end}`;

    return {
      title: booking.title,
      start: startTime,
      end: endTime,      
      
      extendedProps: {
        date: booking.appointment_date,
        status: booking.booking_status,
        doctor_name: booking.doctor_name,
        patient_name: booking.patient_name,
        notes: booking.notes,
        formattedStart: formatTime(startTime),
        formattedEnd: formatTime(endTime)
      }
    };
  });

  const handleEventClick = (info) => {
    const { date, status, doctor_name, patient_name, notes } = info.event.extendedProps;
    setSelectedAppointment({
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      date: date,
      status: status,
      doctor_name: doctor_name,
      patient_name: patient_name,
      notes: notes,
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const renderEvent = (eventInfo) => {
    const status = eventInfo.event._def.extendedProps.status;
    const title = eventInfo.event._def.title;
    return (
      <span className='relative items-center overflow-hidden text-center'>
        <div className={`absolute top-1 left-1 rounded-full w-2 h-2 ${status === "Success" ? 'bg-app-complete' : 'bg-app-coming'}`}></div>
        <span className='pl-4'>{title}</span>
      </span>
    )
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const localeOptions = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true}

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientLayout>
        <Head title="Scheduling" />

        <div className="grid grid-cols-12 h-screen">
          <div className="col-span-12 lg:col-span-7">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              eventContent={renderEvent}
              headerToolbar={{
                start: "today, prev, next",
                center: "title",
                // end: ""
              }}
              events={bookingSchedule}
              selectable={true}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day'
              }}
            />
            <div className='flex justify-center gap-16 mt-4'>
              <span className='flex gap-2 items-center'>
                <div className='w-4 h-4 bg-app-complete'></div>
                Completed
              </span>
              <span className='flex gap-2 items-center'>
                <div className='w-4 h-4 bg-app-coming'></div>
                Coming
              </span>
            </div>
            {
              latestFinishedBookings && (
                <div className='flex flex-col justify-center items-center mt-8'>
                  <span>Previous Sched: {new Date(latestFinishedBookings.appointment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                  <span>{latestFinishedBookings.title} by Dr. {latestFinishedBookings.doctor_name}</span>
                </div>
              )
            } 
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 p-4">
            {
              futureSchedules.map( (sc,idx) => {
                  
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
                    <section ref={ref} onClick={handleOnClick} key={idx} style={{top: `-${top}px`}} className={`${visible ? 'z-50' : 'z-0'} transition max-h-max relative bg-white w-full border border-black rounded-xl`}>
                        <div className='header bg-secondary-bg py-2 px-4 rounded-t-xl'>
                            {sc.period}
                        </div>
                        <div className='py-4 px-8 flex flex-col'>
                            {
                              sc.schedule.length > 0 ? (
                                sc.schedule.map( (x, i) => {
                                  return (
                                    <div key={i}>
                                      <span className='text-sm'>{new Date(x.appointment_date).toDateString()} - {x.title} - Dr.{x.doctor}</span>
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
          <div className="col-span-12 flex flex justify-center gap-4 p-4">
            <button className='bg-secondary-bg hover:bg-primary-bg hover:text-white transition px-4 md:px-8 py-2 md:py-4 rounded-full border-2 border-black' onClick={() => { toggleModal(); }}>
              Add Schedules
            </button>      
          </div>
        </div>

      </PatientLayout>

      {showModal && (
        <AppointmentModal
          showModal={showModal}
          toggleModal={closeModal}
          doctors={doctors}
        />
      )}
    </Suspense>
  );
}

export default Appointment