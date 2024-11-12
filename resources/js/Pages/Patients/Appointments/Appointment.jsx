import React, { Suspense, useState } from 'react'
import { Head } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const Appointment = () => {
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

    const barangayEvent = {
      title: 'Dental and General Checkup',
      date_start: '2024-04-29T00:00:00.000Z',
      date_end: '2024-04-29T15:00:00.000Z',
      location: 'BHW Center',
      doctor_name: 'Victor Chiong',
      bhw_name: 'Victor BHW'
    }

    const localeOptions = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true}

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientLayout>
                <Head title="Scheduling" />

                <div className="grid grid-cols-12 h-screen">
                    <div className="col-span-7">
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

                    <div className="col-span-5 flex flex-col gap-4 p-4">
                      {
                        barangayEvent && (
                          <section className='p-8 '>
                            <div className='relative z-10'>
                              <div className='w-full h-full absolute bg-secondary-bg top-8 left-8 rounded-md z-10 '></div>
                              <div className='relative border-2 rounded-md border-black bg-white p-4 z-50'>
                                {
                                  [
                                    {head: "WHAT", item: barangayEvent.title},
                                    {head: "WHEN", item: `${new Date(barangayEvent.date_start).toLocaleString('en-US', {
                                      timeZone: 'Asia/Manila',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })} ${new Date(barangayEvent.date_start).toLocaleTimeString('en-US',localeOptions)} - ${new Date(barangayEvent.date_end).toLocaleTimeString('en-PH',localeOptions)}`},
                                    {head: "WHERE", item: barangayEvent.location},
                                    {head: "DOC In-Charge", item: `Dr. ${barangayEvent.doctor_name} MD`},
                                    {head: "BHW In-Charge", item: barangayEvent.bhw_name},
                                  ].map( (itm, idx) => {
                                    return (
                                      <div key={idx} className='flex flex-col'>
                                        <span>{itm.head}:</span>
                                        <span className='pl-8'>{itm.item}</span>
                                      </div>
                                    )
                                  })
                                }
                                <div className='flex justify-center mt-8'>
                                  <button className='bg-secondary-bg hover:bg-primary-bg hover:text-white transition px-8 py-4 rounded-full border-2 border-black'>
                                    Book Appointment
                                  </button>
                                </div>
                              </div>
                            </div>
                          </section>
                        )
                      }
                      <FullCalendar
                          plugins={[listPlugin]}
                          initialView="listWeek"
                          events={bookingSchedule}
                          selectable={true}
                          eventClick={handleEventClick}
                          headerToolbar={false}
                      />            
                    </div>
                </div>
            </PatientLayout>

            {/* {showModal && (
                <AppointmentModal
                    showModal={showModal}
                    toggleModal={closeModal}
                    selectedAppointment={selectedAppointment}
                />
            )} */}
        </Suspense>
    );
}

export default Appointment