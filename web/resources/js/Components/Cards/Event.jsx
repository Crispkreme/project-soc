import React from 'react';

const Event = ({ event }) => {
    const isBooking = !!event.event_name;
    
    const eventDate = new Date(isBooking ? event.event_date : event.date);
    const day = String(eventDate.getDate()).padStart(2, '0');

    const formatTimeToAMPM = (time) => {
        if (!time) return '';
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 bg-white border border-gray-300 rounded-xl overflow-hidden items-center justify-start">
            <div className="flex items-center justify-center w-full md:w-32 h-32 flex-shrink-0 bg-blue-100 text-4xl font-bold text-blue-600">
                {day}
            </div>
            <div className="flex flex-col gap-2 py-2">
                <p className="text-xl font-bold">{event.event_name}</p>
                <p className="text-gray-500">
                    {event.event_time}
                    <br />
                    {event.venue}
                    <br />
                </p>
            </div>
        </div>
    );
};

export default Event;
