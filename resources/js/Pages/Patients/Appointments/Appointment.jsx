import React, { Suspense } from 'react';
import { Head, useForm } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from 'react-hot-toast';

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));

const Appointment = ({ barangayEvents, doctors, latestBarangayEvent }) => {
  const today = new Date().toISOString().split('T')[0];

  const bookingSchedule = barangayEvents.map((event) => ({
    id: event.id,
    title: event.event_name,
    start: `${event.event_date}T${event.event_start}`,
    end: `${event.event_date}T${event.event_end}`,
    extendedProps: {
      doctor_name: event.doctor_name,
      bhw_name: event.bhw_name,
      venue: event.event_venue,
      time: event.event_time,
      status: event.booking_status,
      isPast: event.event_date < today,
    },
  }));

  const { data, setData, post, processing, errors } = useForm({
    approve_by_id: null,
    patient_id: null,
    approved_date: null,
    booking_status: 'Approve',
    event_name: '',
    event_venue: '',
    event_date: '',
    event_start: '',
    event_end: '',
  });

  const timeSchedule = [
    { value: "08:00", label: "08:00 AM" },
    { value: "09:00", label: "09:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "13:00", label: "01:00 PM" },
    { value: "14:00", label: "02:00 PM" },
    { value: "15:00", label: "03:00 PM" },
    { value: "16:00", label: "04:00 PM" },
    { value: "17:00", label: "05:00 PM" },
  ];

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const { extendedProps } = event;

    if (extendedProps.isPast) {
      toast.error("This appointment date has passed and cannot be booked.");
      return;
    }

    setData({
      ...data,
      event_id: event.id,
      event_name: event.title,
      event_venue: extendedProps.venue,
      event_date: event.start.toISOString().split('T')[0],
      event_start: event.start.toTimeString().split(' ')[0],
      event_end: event.end ? event.end.toTimeString().split(' ')[0] : '',
    });
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    post(route('patient.create.booking'), {
      onSuccess: (response) => {
        const flash = response.props?.flash;
        if (flash?.error) {
          console.error('Error:', flash.error);
          toast.error(flash.error);
        }

        if (flash?.success) {
          console.log('Success:', flash.success);
          toast.success(flash.success);
        }
      },
      onError: (errors) => {
        console.error('Failed to book appointment:', errors);
      },
    });
  };

  const renderEvent = (eventInfo) => {
    const { status, isPast } = eventInfo.event.extendedProps;

    return (
      <span className="relative items-center overflow-hidden text-center">
        <div
          className={`absolute top-1 left-1 rounded-full w-2 h-2 ${
            status === 'Success' ? 'bg-green-500' : status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'
          }`}
        ></div>
        <span
          className={`pl-4 ${isPast ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
        >
          {eventInfo.event.title}
        </span>
      </span>
    );
  };

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
                start: 'today, prev, next',
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={bookingSchedule}
              selectable={true}
              eventClick={handleEventClick}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
              }}
            />
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 p-4">
            <form onSubmit={handleBookAppointment}>
              <div className="p-8">
                <div>
                  <label>Event Name:</label>
                  <input
                    type="text"
                    value={data.event_name}
                    name="event_name"
                    onChange={(e) => setData("event_name", e.target.value)}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className='mt-2'>
                  <label>Event Venue:</label>
                  <input
                    type="text"
                    value={data.event_venue}
                    name="event_venue"
                    onChange={(e) => setData("event_venue", e.target.value)}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className='mt-2'>
                  <label>Event Date:</label>
                  <input
                    type="date"
                    value={data.event_date}
                    name="event_date"
                    onChange={(e) => setData("event_date", e.target.value)}
                    className="border w-full p-2 rounded"
                  />
                </div>
                <div className='mt-2'>
                  <InputLabel value="Start Time" />
                  <ComboBox
                    items={timeSchedule}
                    value={timeSchedule.find((time) => time.value === data.event_start)}
                    onChange={(selected) => setData("event_start", selected ? selected.value : "")}
                    placeholder="Select Start Time"
                    displayKey="label"
                  />
                  <InputError message={errors.event_start} />
                </div>
                <div className='mt-2'>
                  <InputLabel value="End Time" />
                  <ComboBox
                    items={timeSchedule}
                    value={timeSchedule.find((time) => time.value === data.event_end)}
                    onChange={(selected) => setData("event_end", selected ? selected.value : "")}
                    placeholder="Select End Time"
                    displayKey="label"
                  />
                  <InputError message={errors.event_end} />
                </div>
                <div className="mt-4">
                  <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${
                      processing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Book Appointment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </PatientLayout>
    </Suspense>
  );
};

export default Appointment;
