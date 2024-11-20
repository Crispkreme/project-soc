import React, { Suspense } from 'react';
import { Head, useForm } from '@inertiajs/react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));

const Appointment = ({ barangayEvents, doctors }) => {

  const bookings = [
    {
      title: 'General Consultation',
      notes: 'Sample Descriptions',
      appointment_date: '2024-11-11',
      doctor_name: 'Victor Chiong',
      patient_name: 'Victor Wawa',
      appointment_start: '09:00:00.000Z',
      appointment_end: '05:00:00.000Z',
      booking_status: 'Success',
    },
    {
      title: 'Dentism',
      notes: 'Sample Descriptions',
      appointment_date: '2024-11-15',
      doctor_name: 'Victor Chiong',
      patient_name: 'Victor Wawa',
      appointment_start: '09:00:00.000Z',
      appointment_end: '05:00:00.000Z',
      booking_status: 'Pending',
    },
  ];

  const completedBookings = bookings.filter((booking) => booking.booking_status === 'Success');
  const latestFinishedBookings = completedBookings.length > 0 ? completedBookings[completedBookings.length - 1] : null;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const bookingSchedule = bookings.map((booking) => {
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
        formattedEnd: formatTime(endTime),
      },
    };
  });

  const { data, setData, post, processing, errors } = useForm({
    approve_by_id: null,
    patient_id: 1,
    title: barangayEvents.event_name,
    notes: barangayEvents.event_venue,
    appointment_date: barangayEvents.event_date,
    appointment_start: barangayEvents.event_start,
    appointment_end: barangayEvents.event_end,
    approved_date: null,
    booking_status: null,
  });
  
  const handleBookAppointment = () => {
    const appointmentData = {
      approve_by_id: null,
      patient_id: 1, 
      title: barangayEvents.event_name,
      notes: barangayEvents.event_venue,
      appointment_date: barangayEvents.event_date,
      appointment_start: barangayEvents.event_start,
      appointment_end: barangayEvents.event_end,
      approved_date: null,
      booking_status: null,
    };
  
    post(route('patient.create.booking'), {
      headers: {
        'Content-Type': 'application/json', 
      },
      onSuccess: () => {
        alert('Appointment booked successfully!');
      },
      onError: (errors) => {
        console.error('Failed to book appointment:', errors);
      },
    });
  };
  
  const renderEvent = (eventInfo) => {
    const status = eventInfo.event.extendedProps.status;
    return (
      <span className="relative items-center overflow-hidden text-center">
        <div
          className={`absolute top-1 left-1 rounded-full w-2 h-2 ${
            status === 'Success' ? 'bg-app-complete' : 'bg-app-coming'
          }`}
        ></div>
        <span className="pl-4">{eventInfo.event.title}</span>
      </span>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientLayout>
        <Head title="Scheduling" />

        <div className="grid grid-cols-12 h-screen">
          {/* Calendar Section */}
          <div className="col-span-12 lg:col-span-7">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              eventContent={renderEvent}
              headerToolbar={{
                start: 'today, prev, next',
                center: 'title',
              }}
              events={bookingSchedule}
              selectable={true}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
              }}
            />
            <div className="flex justify-center gap-16 mt-4">
              <span className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-app-complete"></div>
                Completed
              </span>
              <span className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-app-coming"></div>
                Coming
              </span>
            </div>
            {latestFinishedBookings && (
              <div className="flex flex-col justify-center items-center mt-8">
                <span>
                  Previous Sched:{' '}
                  {new Date(latestFinishedBookings.appointment_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span>
                  {latestFinishedBookings.title} by Dr. {latestFinishedBookings.doctor_name}
                </span>
              </div>
            )}
          </div>

          {/* Appointment Details Section */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 p-4">
            {barangayEvents && (
              <section className="p-8">
                <div className="relative z-10">
                  <div className="w-full h-full absolute bg-secondary-bg top-8 left-8 rounded-md z-10"></div>
                  <div className="relative border-2 rounded-md border-black bg-white p-4 z-50">
                    {[
                      { head: 'WHAT', item: barangayEvents.event_name },
                      {
                        head: 'WHEN',
                        item: `${new Date(
                          barangayEvents.event_date + 'T' + barangayEvents.event_start
                        ).toLocaleString('en-US', {
                          timeZone: 'Asia/Manila',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })} ${new Date(
                          barangayEvents.event_date + 'T' + barangayEvents.event_start
                        ).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })} - ${new Date(
                          barangayEvents.event_date + 'T' + barangayEvents.event_end
                        ).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}`,
                      },
                      { head: 'WHERE', item: barangayEvents.event_venue },
                      { head: 'DOC In-Charge', item: `Dr. ${barangayEvents.doctor_name} MD` },
                      { head: 'BHW In-Charge', item: barangayEvents.bhw_name },
                    ].map((itm, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span>{itm.head}:</span>
                        <span className="pl-8">{itm.item}</span>
                      </div>
                    ))}
                    <div className="flex justify-center mt-8">
                      <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${
                          processing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleBookAppointment}
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : 'Book Appointment'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </PatientLayout>
    </Suspense>
  );
};

export default Appointment;
