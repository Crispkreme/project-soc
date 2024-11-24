import React, { Suspense, useState } from "react";
import { Head } from "@inertiajs/react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import GenericButton from "../../../Components/Buttons/GenericButton";

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const AppointmentModal = React.lazy(() => import("@/Components/Forms/AppointmentModal"));

const Appointment = ({ barangayEvents }) => {
  const [showModal, setShowModal] = useState(false);

  // Format barangayEvents to FullCalendar-friendly format
  const events = barangayEvents.map((event) => ({
    id: event.id,
    title: event.event_name,
    start: `${event.event_date}T${event.event_start}`,
    end: `${event.event_date}T${event.event_end}`,
    extendedProps: {
      venue: event.event_venue,
      doctor_id: event.doctor_id,
      bhw_id: event.bhw_id,
    },
  }));

  // Toggle modal
  const toggleModal = () => setShowModal((prev) => !prev);
  const closeModal = () => setShowModal(false);

  // Render event details
  const renderEvent = (eventInfo) => {
    const { venue } = eventInfo.event.extendedProps;
    return (
      <div className="flex flex-col text-left">
        <span className="font-bold">{eventInfo.event.title}</span>
        <span>{venue}</span>
      </div>
    );
  };

  // Handle event click
  const handleEventClick = (info) => {
    console.log("Event clicked:", info.event);
  };

  // Debugging: Log formatted events
  console.log("Formatted Events:", events);

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
          headerToolbar={{
            left: "today prev next",
            center: "title",
            right: "dayGridMonth",
          }}
          events={events} // Pass the correctly formatted events
          eventContent={renderEvent}
          eventClick={handleEventClick}
          height="100vh"
        />
      </PatientLayout>

      {showModal && (
        <AppointmentModal
          showModal={showModal}
          toggleModal={closeModal}
          barangayEvents={barangayEvents}
        />
      )}
    </Suspense>
  );
};

export default Appointment;
