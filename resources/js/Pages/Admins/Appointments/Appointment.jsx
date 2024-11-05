import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));

const Appointment = ({ bookings }) => {

    const bookingSchedule = bookings.map(booking => ({
        title: booking.title,
        start: `${booking.appointment_date}T${booking.appointment_start}`,
        end: `${booking.appointment_date}T${booking.appointment_end}`,    
    }));

    console.log(bookingSchedule);

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
                            events={bookingSchedule}
                            selectable={false}
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
                            plugins={[ listPlugin ]}
                            initialView="listWeek"
                            events={bookingSchedule}
                            selectable={false}
                            headerToolbar={false}
                            height="100vh"
                        />            
                    </div>
                </div>
            </AdminLayout>
        </Suspense>
    );
}

export default Appointment;
