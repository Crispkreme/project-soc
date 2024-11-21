import React, { Suspense, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import GenericButton from '../../../Components/Buttons/GenericButton';

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const AppointmentModal = React.lazy(() => import("./AppointmentModal"));

const Appointment = ({ consultations, doctors }) => {
  const months = Object.keys(consultations);

  const record = months.map(month => ({
    period: month,
    events: consultations[month],
  }));

  const [showModal, setShowModal] = useState(false);

  const handleEventClick = (info) => {
    // Define behavior for calendar event click
  };

  const formatTimeRange = (timeRange) => {
    const formatTime = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const suffix = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
    };
  
    const [startTime, endTime] = timeRange.split(" - ");
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };
  

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  
  const closeModal = () => {
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const renderEvent = (eventInfo) => {
    const status = eventInfo.event.extendedProps.status || "Upcoming";
    const title = eventInfo.event.title;
    return (
      <span className='relative items-center overflow-hidden text-center'>
        <div
          className={`absolute top-1 left-1 rounded-full w-2 h-2 ${
            status === "Success" ? "bg-app-complete" : "bg-app-coming"
          }`}
        ></div>
        <span className='pl-4'>{title}</span>
      </span>
    );
  };

  const cur = usePage().props.auth.user;

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
              }}
              selectable={true}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
              }}
            />
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 p-4">
            {record.map((monthData, idx) => (
              <div key={idx} className="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
                <h3 className="font-bold text-lg mb-2">{monthData.period}</h3>
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Appointment</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.events.map((event, eventIdx) => (
                      <tr key={eventIdx} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{event.appointment}</td>
                        <td className="px-6 py-4">{formatDate(event.date)}</td>
                        <td className="px-6 py-4">{formatTimeRange(event.time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="col-span-12 flex justify-center">
            <GenericButton onClick={toggleModal} className='py-4 px-8'>
              Add Schedules
            </GenericButton>
          </div>
        </div>

      </PatientLayout>

      {showModal && (
        <AppointmentModal
          showModal={showModal}
          toggleModal={closeModal}
          doctor={cur}
        />
      )}
    </Suspense>
  );
};

export default Appointment;
