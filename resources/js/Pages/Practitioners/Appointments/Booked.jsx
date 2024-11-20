import React, { useState } from "react";
import PatientLayout from "@/Layouts/PatientLayout";
import { Inertia } from '@inertiajs/inertia';
import { MdOutlinePendingActions } from "react-icons/md";
import { BsClipboardCheck } from "react-icons/bs";
import { LuClipboardEdit } from "react-icons/lu";
import { TbClipboardX } from "react-icons/tb";

const Booked = ({ bookings }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeRange = (start, end) => {
    const formatTime = (time) =>
      new Date(`1970-01-01T${time}Z`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const users = bookings.map((booking, index) => ({
    id: index + 1,
    patientName: booking.patient_name,
    appointment: booking.title,
    date: formatDate(booking.appointment_date),
    time: formatTimeRange(booking.appointment_start, booking.appointment_end),
    status: booking.booking_status,
    bookingId: booking.id // Include booking ID
  }));

  const statusIcons = {
    Inprogress: <LuClipboardEdit className="w-5 h-5" />,
    Success: <BsClipboardCheck className="w-5 h-5" />,
    Pending: <MdOutlinePendingActions className="w-5 h-5" />,
    Failed: <TbClipboardX className="w-5 h-5" />,
  };

  const getStatusButton = (status, bookingId) => {
    const buttonClasses = {
      Inprogress: "w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2",
      Success: "w-full text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2",
      Pending: "w-full text-yellow-700 hover:text-white border border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2",
      Failed: "w-full text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2",
    };

    const handleButtonClick = () => {
      if (status === "Inprogress") {
        Inertia.post(route('practitioner.approve.appointments', { id: bookingId }));
      }
    };

    const isDisabled = status === "Success";

    return (
      <button
        type="button"
        className={buttonClasses[status]}
        disabled={isDisabled}
        onClick={handleButtonClick} 
      >
        {statusIcons[status]} <span>{status}</span>
      </button>
    );
  };

  const getStatusBadgeClasses = (status) => {
    const badgeClasses = {
      Inprogress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return badgeClasses[status] || '';
  };

  return (
    <PatientLayout>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white">
          <div className="relative">
            <button
              id="dropdownActionButton"
              onClick={toggleDropdown}
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
            >
              <span className="sr-only">Action button</span>
              Action
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {dropdownVisible && (
              <div className="absolute left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 mt-1">
                <ul className="py-1 text-sm text-gray-700">
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Reward</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Promote</a></li>
                  <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Activate account</a></li>
                </ul>
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Delete User
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for users"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Patient</th>
              <th scope="col" className="px-6 py-3">Appointment</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Time</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.patientName}</td>
                <td className="px-6 py-4">{user.appointment}</td>
                <td className="px-6 py-4">{user.date}</td>
                <td className="px-6 py-4">{user.time}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium me-2 px-2.5 py-0.5 rounded ${getStatusBadgeClasses(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusButton(user.status, user.bookingId)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PatientLayout>
  );
};

export default Booked;
