import React, { lazy, memo, useCallback, useState } from "react";
import PatientLayout from "@/Layouts/PatientLayout";
import { Inertia } from '@inertiajs/inertia';
import { MdOutlinePendingActions } from "react-icons/md";
import { BsClipboardCheck } from "react-icons/bs";
import { LuClipboardEdit } from "react-icons/lu";
import { TbClipboardX } from "react-icons/tb";
import { useForm, usePage } from "@inertiajs/react";

const GenericButton = lazy(() => import("@/Components/Buttons/GenericButton"));
const Modal = lazy(() => import("@/Components/Modals/Modal"));

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

  const doctor = usePage().props.auth.user;

  const AddModal = memo(function AddModal({children}) {
    const [state, setState] = useState({
      open: false
    });
    const OpenModal = useCallback(() => setState(prev => ({...prev, open:true})));
    return (
      <>
      <GenericButton onClick={OpenModal} className="text-xs py-1 px-4 text-black">
        Add
      </GenericButton>
      <Modal show={state.open} onClose={() => setState(prev => ({...prev, open: false}))}>
        {children}
      </Modal>
      </>
    )
  });

  const AddPrescriptionModal = memo(function AddPrescriptionModal({user_id, patient_name, patient_age=25}) {
    const { data, setData, post, processing, errors } = useForm({
      prescription: ''
    });
    return (
      <AddModal>
        <form>
          <div className='w-full bg-secondary-bg px-4 py-2'>
            <h1 className='text-lg text-white'>Add Prescription</h1>
          </div>
          <div className='px-4 py-2 font-light text-sm flex flex-col gap-4'>
            <h1 className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</h1>
            <div className='flex flex-row w-full gap-32'>
              <h1 className="text-sm text-gray-600">Patient: {patient_name}</h1>
              <h1 className="text-sm text-gray-600">Age: {patient_age}</h1>
            </div>
            <div className="mt-4">
              <div>
                <div className="mt-2">
                  <label className={`block text-sm font-medium text-gray-700 `}>
                      Prescription
                  </label>
                  <textarea
                    id={"prescription"}
                    name={"prescription"}
                    rows={5}
                    placeholder={"What will you prescribe?"}
                    value={data.prescription}
                    onChange={(e) => setData("prescription", e.target.value)}
                    className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full`}
                  ></textarea>
                </div>
                <p className="mt-3 text-sm text-gray-600">Tell us the prescription</p>
              </div>
            </div>
            <h1 className="text-sm text-gray-600">Interview: </h1>
            <h1 className="text-sm text-gray-600">Medicine Allergies: </h1>
            <h1 className="text-sm text-gray-600">Family History: </h1>
            <div className='flex flex-col justify-center pt-8 items-center'>
              {/* Need to change to doctor's name */}
              <img src={"/assets/image/signature.png"} height={10} width={100}/>
              <h1>{doctor.username}</h1>
            </div>
            <GenericButton className="self-center text-xs py-2 px-8 text-black">
              Add
            </GenericButton>
          </div>
        </form>
      </AddModal>
    )
  });

  const AddReferralModal = memo(function AddReferralModal({patient, patient_age=25}) {
    const { data, setData, post, processing, errors } = useForm({
      referral_to: '',
      doctor: '',
      bhw: '',
    });
    return (
      <AddModal>
        <form>
          <div className='w-full bg-secondary-bg px-4 py-2'>
            <h1 className='text-lg text-white'>Add Referral</h1>
          </div>
          <div className='px-4 py-2 font-light text-sm flex flex-col gap-2'>
            <h1 className="text-lg text-gray-600 py-4">Patient</h1>
            <h1 className="text-sm text-gray-600">Patient: {patient.patient_name}</h1>
            <h1 className="text-sm text-gray-600">Age: {patient_age}</h1>
            <h1 className="text-sm text-gray-600">Diagnosis: Sample Diagnosis</h1>

            <h1 className="text-lg text-gray-600 py-4">Details</h1>
            {/* Details */}
            <div>
              <div className='flex items-center gap-4'>
                <label className={`block text-sm font-medium text-gray-700 `}>
                  Reffer to:
                </label>
                <input
                    type="text"
                    value={data.referral_to}
                    onChange={(e) => setData("referral_to", e.target.value)}
                    className={'rounded-md text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '}
                />
              </div>
              { errors.referral_to && <p className={'text-sm text-red-600 '}>{errors.referral_to}</p>}
            </div>

            {/* Doc in charge */}
            <div>
              <div className='flex items-center gap-4'>
                <label className={`block text-sm font-medium text-gray-700 `}>
                  Doc In-charge:
                </label>
                <input
                    type="text"
                    value={data.doctor}
                    onChange={(e) => setData("doctor", e.target.value)}
                    className={'rounded-md text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '}
                />
              </div>
              { errors.doctor && <p className={'text-sm text-red-600 '}>{errors.doctor}</p>}
            </div>

            {/* BHW In charge */}
            <div>
              <div className='flex items-center gap-4'>
                <label className={`block text-sm font-medium text-gray-700 `}>
                  BHW In-charge:
                </label>
                <input
                    type="text"
                    value={data.bhw}
                    onChange={(e) => setData("bhw", e.target.value)}
                    className={'rounded-md text-sm border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '}
                />
              </div>
              { errors.bhw && <p className={'text-sm text-red-600 '}>{errors.bhw}</p>}
            </div>

            <h1 className="text-sm text-gray-600">Date of referral: {new Date().toDateString()}</h1>
            <div className='flex flex-col justify-center pt-8 items-center'>
              {/* Need to change to doctor's name */}
              <img src={"/assets/image/signature.png"} height={10} width={100}/>
              <h1>{doctor.username}</h1>
            </div>
            <GenericButton className="self-center text-xs py-2 px-8 text-black">
              Add
            </GenericButton>
          </div>
        </form>
      </AddModal>
    )
  });

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
              <th scope="col" className="px-6 py-3">Prescription</th>
              <th scope="col" className="px-6 py-3">Referral</th>
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
                  <AddPrescriptionModal user_id={user.id} patient_name={user.patientName}/>
                </td>
                <td className="px-6 py-4">
                  <AddReferralModal patient={user} />
                </td>
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
