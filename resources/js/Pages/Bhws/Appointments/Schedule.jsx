import React, { Suspense, useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const AppointmentModal = React.lazy(() => import("./AppointmentModal"));

const Schedule = ({ bookings }) => {

    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const filteredBookingSchedule = useMemo(() => {
        return bookings.filter((booking) => {
            const startTime = new Date(`${booking.appointment_date}T${booking.appointment_start}`);
            return startTime.getMonth() === currentMonth && startTime.getFullYear() === currentYear;
        }).map(booking => {
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
    }, [bookings, currentMonth, currentYear]);

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

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLayout>
                <Head title="Scheduling" />

                <div className="grid grid-cols-12 h-screen">
                    <div className="col-span-8">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                start: "today, prev, next",
                                center: "title",
                                end: ""
                            }}
                            events={filteredBookingSchedule}
                            selectable={true}
                            height="100vh"
                            buttonText={{
                                today: 'Today',
                                month: 'Month',
                                week: 'Week',
                                day: 'Day'
                            }}
                        />
                    </div>

                    <div className="col-span-4 flex flex-col gap-4 p-4">
                        <FullCalendar
                            plugins={[listPlugin]}
                            initialView="listMonth"
                            events={filteredBookingSchedule}
                            selectable={true}
                            eventClick={handleEventClick}
                            headerToolbar={false}
                            height="100vh"
                        />            
                    </div>
                </div>
            </AdminLayout>

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
