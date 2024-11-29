import React, { Suspense, useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const AppointmentModal = React.lazy(() => import("./AppointmentModal"));

const Schedule = ({ bookings = [] }) => {

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const bookingSchedule = useMemo(() => {
        return bookings.map((event) => {
            const eventDateTime = new Date(`${event.event_date}T${event.event_start}`);
            const todayDateTime = new Date();
    
            return {
                id: event.id,
                title: event.event_name,
                start: `${event.event_date}T${event.event_start}`,
                end: `${event.event_date}T${event.event_end}`,
                extendedProps: {
                    doctor_name: event.doctor_name,
                    bhw_name: event.bhw_name,
                    venue: event.event_venue,
                    time: event.event_time,
                    status: event.booking_status || "N/A",
                    isPast: eventDateTime < todayDateTime,
                },
            };
        });
    }, [bookings]);
    

    const filteredBookingSchedule = useMemo(() => {
        return bookings
            .filter((event) => {
                const eventDate = new Date(`${event.event_date}T${event.event_start}`);
                return (
                    eventDate.getMonth() === currentMonth &&
                    eventDate.getFullYear() === currentYear
                );
            })
            .map((event) => ({
                id: event.id,
                title: event.event_name,
                start: `${event.event_date}T${event.event_start}`,
                end: `${event.event_date}T${event.event_end}`,
                extendedProps: {
                    date: event.event_date,
                    status: event.booking_status || "N/A",
                    doctor_name: event.doctor_name,
                    venue: event.event_venue,
                    time: event.event_time,
                    formattedStart: formatTime(`${event.event_date}T${event.event_start}`),
                    formattedEnd: formatTime(`${event.event_date}T${event.event_end}`),
                },
            }));
    }, [bookings, currentMonth, currentYear]);

    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleEventClick = (info) => {
        const {
            date,
            status,
            doctor_name,
            venue,
            time,
            formattedStart,
            formattedEnd,
        } = info.event.extendedProps;

        setSelectedAppointment({
            title: info.event.title,
            start: formattedStart,
            end: formattedEnd,
            date: date,
            status: status,
            doctor_name: doctor_name,
            venue: venue,
            time: time,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAppointment(null);
    };

    const renderEvent = (eventInfo) => {
        const { status, isPast } = eventInfo.event.extendedProps;

        return (
            <span className="relative items-center overflow-hidden text-center">
                <div
                    className={`absolute top-1 left-1 rounded-full w-2 h-2 ${
                        status === "Success"
                            ? "bg-green-500"
                            : status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                ></div>
                <span
                    className={`pl-4 ${
                        isPast ? "text-gray-400 cursor-not-allowed" : "text-black"
                    }`}
                >
                    {eventInfo.event.title}
                </span>
            </span>
        );
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Scheduling" />

                <div className="grid grid-cols-12 h-screen">
                    {/* Main Calendar */}
                    <div className="col-span-8">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            eventContent={renderEvent}
                            headerToolbar={{
                                start: "today, prev, next",
                                center: "title",
                                end: "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            events={bookingSchedule}
                            selectable={true}
                            eventClick={handleEventClick}
                            buttonText={{
                                today: "Today",
                                month: "Month",
                                week: "Week",
                                day: "Day",
                            }}
                        />
                    </div>

                    {/* List View */}
                    <div className="col-span-4 flex flex-col gap-4 p-4">
                        <FullCalendar
                            plugins={[listPlugin]}
                            initialView="listMonth"
                            headerToolbar={{
                                start: "prev, next",
                            }}
                            events={bookingSchedule}
                            selectable={true}
                            eventClick={handleEventClick}
                            height="100vh"
                        />
                    </div>
                </div>
            </AdminLayout>

            {/* Appointment Modal */}
            {showModal && (
                <AppointmentModal
                    showModal={showModal}
                    toggleModal={closeModal}
                    selectedAppointment={selectedAppointment}
                />
            )}
        </Suspense>
    );
};

export default Schedule;
