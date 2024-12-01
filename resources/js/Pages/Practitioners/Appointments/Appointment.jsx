import React, { Suspense, useState, useMemo } from "react";
import { Head } from "@inertiajs/react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import GenericButton from "../../../Components/Buttons/GenericButton";

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const BarangayEventModal = React.lazy(() => import("@/Components/Forms/BarangayEventModal"));

const Appointment = ({ bookings = [], doctors, bhws }) => {

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [filteredBarangayEvents, setFilteredBarangayEvents] = useState(bookings);
  const [selectedBarangayEvent, setSelectedBarangayEvent] = useState(null);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredBookingSchedule = useMemo(() => {
    return bookings
      .map((booking) => {
        const parsedDate = new Date(booking.event_date);

        if (isNaN(parsedDate.getTime())) {
          console.error(`Invalid event_date: ${booking.event_date}`);
          return null;
        }

        const startTime = new Date(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate(),
          ...booking.event_start.split(":").map(Number)
        );
        const endTime = new Date(
          parsedDate.getFullYear(),
          parsedDate.getMonth(),
          parsedDate.getDate(),
          ...booking.event_end.split(":").map(Number)
        );

        return {
          title: booking.event_name,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          extendedProps: {
            date: booking.event_date,
            doctor_name: booking.doctor_name,
            bhw_name: booking.bhw_name,
            venue: booking.event_venue,
            formattedStart: formatTime(startTime),
            formattedEnd: formatTime(endTime),
          },
        };
      })
      .filter((event) => event !== null);
  }, [bookings]);

  const toggleModal = () => setShowModal((prev) => !prev);
  const renderEvent = (eventInfo) => {
    const { venue } = eventInfo.event.extendedProps;
    return (
      <div className="flex flex-col text-left">
        <span className="font-bold">{eventInfo.event.title}</span>
        <span>{venue}</span>
      </div>
    );
  };

  const toggleBarangayEventModal = (barangayEvent = null, isEditing = false, isViewing = false) => {
    setSelectedBarangayEvent(barangayEvent);
    setIsEditing(isEditing);
    setIsViewing(isViewing);
    setShowModal(!showModal);
};  

  // Handle event click
  const handleEventClick = (info) => {
    console.log("Event clicked:", info.event);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PatientLayout>
        <Head title="Scheduling" />

        <div className="flex justify-end mb-4">
          <GenericButton onClick={toggleModal} className="py-4 px-8">
            Add Schedules
          </GenericButton>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          eventContent={renderEvent}
          headerToolbar={{
            start: "today, prev, next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={filteredBookingSchedule}
          selectable={true}
          eventClick={handleEventClick}
          buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
          }}
        />
      </PatientLayout>

      {showModal && <BarangayEventModal 
        showModal={showModal} 
        toggleBarangayEventModal={toggleBarangayEventModal} 
        doctors={doctors} 
        barangayEvents={bookings}
        bhws={bhws}
        isEditing={isEditing}
        isViewing={isViewing}
        selectedBarangayEvent={selectedBarangayEvent}
      />}
    </Suspense>
  );
};

export default Appointment;
