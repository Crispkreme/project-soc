import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { PiAddressBookBold } from 'react-icons/pi';
import { RiCalendarTodoLine, RiCloseFill, RiMenuFill } from 'react-icons/ri';
import Dropdown from '@/Components/Inputs/Dropdown';
import { FaGripLines } from 'react-icons/fa';
import Sidebar from '../Components/Sidebars/Sidebar';
import Header from '../Components/Headers/Header';
import { useSelector, useDispatch } from 'react-redux';
import { closeSidebar } from '../reducers/sidebarSlice';

const logo = "/assets/svg/logo.svg";
const header = "/assets/svg/header.svg";

export default function PatientLayout({children}) {

    const {url, component} = usePage();
    const user = usePage().props.auth.user;
    const open = useSelector(state => state.sidebar.open);
    const dispatch = useDispatch();

    const redirectRole = user.role === "Patient" || user.role === "BHW" ? "Practitioner" : user.role === "Practitioner" ? "Patient" : "BHW";
    const linkOnClick = () => window.innerWidth < 768 ? dispatch(closeSidebar()) : null;

    const curLinks = user.role === "Patient" ? [
      {icon: <RiCalendarTodoLine />,text: "Book Appointments", href: route(`patient.book.appointments`), route: '/patient/book/appointments', sublinks: []},
      {icon: <RiCalendarTodoLine />,text: "Community", href: route(`patient.show.communities.${String(redirectRole).toLowerCase()}`), route: `/patient/show/communities/${String(redirectRole).toLowerCase()}`,
          sublinks: [
              user.role !== "Patient" && {text: "Patients", href: route('patient.show.communities.patient'), route: '/patient/show/communities/patient'},
              user.role !== "Practitioner" && {text: "Practitioners", href: route('patient.show.communities.practitioner'), route: '/patient/show/communities/practitioner'},
              user.role !== "BHW" && {text: "BHWs", href: route('patient.show.communities.bhw'), route: '/patient/show/communities/bhw'},
          ].filter(Boolean)
      },
      {icon: <RiCalendarTodoLine />,text: "Service Available", href: route('patient.show.service.availables'), route: '/patient/show/service/availables',
          sublinks: [
              {text: "Schedule Consultations", href: route('patient.show.schedule.consultations'), route: '/patient/show/schedule/consultations'},
              {text: "Medicine Available", href: route('patient.show.medicine.available'), route: '/patient/show/medicine/available'},
              {text: "Data Analysis Reports", href: route('patient.show.data.analysis'), route: '/patient/show/data/analysis'},
              {text: "BHW Activities", href: route('patient.show.bhw.activities'), route: '/patient/show/bhw/activities'},
          ]
      },
      {icon: <PiAddressBookBold />,text: "My Records", href: route('patient.show.record.medicals'), route: '/patient/show/record/medicals',
          sublinks: [
              {text: "My Medical Records", href: route('patient.show.record.medicals'), route: '/patient/show/record/medicals'},
              {text: "My Medical History", href: route('patient.show.record.histories'), route: '/patient/show/record/histories'},
          ]
      },
  ] : [
    // this is doctor
    {icon: <PiAddressBookBold />,text: "Schedules", href: route('practitioner.book.appointments'), route: '/practitioner/book/appointments',
      sublinks: [
          {text: "Schedules", href: route('practitioner.book.appointments'), route: '/practitioner/book/appointments'},
          {text: "Patient Booked", href: route('practitioner.book.appointments.booked'), route: '/practitioner/book/appointments/booked'},
      ]
    },
    {icon: <RiCalendarTodoLine />,text: "Community", href: route(`practitioner.show.communities.patient`), route: `/practitioner/show/communities/patient`,
      sublinks: [
        user.role !== "Patient" && {text: "Patients", href: route('practitioner.show.communities.patient'), route: '/practitioner/show/communities/patient'},
        user.role !== "Practitioner" && {text: "Practitioners", href: route('practitioner.show.communities.practitioner'), route: '/practitioner/show/communities/practitioner'},
        user.role !== "BHW" && {text: "BHWs", href: route('practitioner.show.communities.bhw'), route: '/practitioner/show/communities/bhw'},
      ].filter(Boolean)
    },
    {icon: <PiAddressBookBold />,text: "Reports", href: route('practitioner.show.report.appointment'), route: '/practitioner/show/reports/appointment',
        sublinks: [
            {text: "Appointment", href: route('practitioner.show.report.appointment'), route: '/practitioner/show/reports/appointment'},
            {text: "Medical Available", href: route('practitioner.show.report.medicine.available'), route: '/practitioner/show/reports/medicine/available'},
            {text: "Data Analytics", href: route('practitioner.show.report.analytics'), route: '/practitioner/show/reports/analytics'},
            {text: "Released", href: route('practitioner.show.report.released'), route: '/practitioner/show/reports/released'},
        ]
    },
  ];

    return (
        <div className='min-h-screen h-full flex flex-col'>
            <section className='flex h-full lg:grow flex-wrap'>
                <Sidebar user={user}>
                    <div className={`h-full mt-4 transition-all text-center bg-white flex py-4 flex-col justify-start rounded-2xl`}>
                        <div className='w-full flex justify-center mb-8'>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button>
                                        <img className='w-32 h-32' src="https://cdn-icons-png.freepik.com/512/700/700674.png" alt="" />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    {
                                        [
                                            {text: "Profile", href: route('patient.view.profile', user.id)},
                                            {text: "Change Password", href: route('patient.view.password', user.id)},
                                            {text: "Log Out", href: route('logout', user.id)},
                                        ].map( (link, idx) => {
                                            return (
                                                <Dropdown.Link
                                                    key={idx}
                                                    href={link.href}
                                                >
                                                    {link.text}
                                                </Dropdown.Link>
                                            )
                                        })
                                    }
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                        {
                            curLinks.map( (link, idx) => {
                                const active = url === link.route | link.sublinks.filter( link => link.route === url).length > 0;
                                return (
                                    <>
                                    <Link key={idx} onClick={linkOnClick} href={link.href} className={`flex items-center gap-4 px-4 py-2 ${url === link.route ? 'text-primary-bg' : 'hover:text-primary-bg'} transition`}>
                                        {link.icon}
                                        <span>{link.text}</span>
                                    </Link>
                                    <ul className={`${active && (open) ? 'visible' : 'hidden'}`}>
                                    {
                                        link.sublinks.map( (sub, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <Link onClick={linkOnClick} key={idx} href={sub.href} className={`flex items-center gap-4 px-8 py-2 ${url === sub.route ? 'text-primary-bg' : 'hover:text-primary-bg'} transition`}>
                                                        <FaGripLines />
                                                        <span>{sub.text}</span>
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                    </>
                                )
                            })
                        }
                    </div>
                </Sidebar>
                
                <section className={`flex flex-col w-[100%] ${open ? 'md:ml-64' : ''} transition-all`}>
                    <div className="header relative p-5 text-white text-center w-full h-full lg:h-[109px]">
                        <img src={header} className='hidden md:block bg-cover absolute w-full h-full top-0 left-0' alt="" />
                        <div className="flex justify-between items-center">
                            <Link href={route('patient.dashboard')}>
                                <img src={logo} alt="Logo" className="w-20 lg:w-32" />
                            </Link>
                            <div className="hidden lg:block z-50 search-bar flex items-center space-x-2">
                                <input
                                type="text"
                                className="form-control text-black px-4 py-2 lg:w-[300px] rounded-lg border border-gray-300"
                                placeholder="Search"
                                />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
                            </div>
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button>
                                            <img src="profile-icon.png" alt="Profile" className="w-12 h-12 rounded-full bg-gray-200" />
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {
                                            [
                                                {text: "Profile", href: route('patient.view.profile', user.id)},
                                                {text: "Change Password", href: route('patient.view.password', user.id)},
                                                {text: "Log Out", href: route('logout', user.id)},
                                            ].map( (link, idx) => {
                                                return (
                                                    <Dropdown.Link
                                                        key={idx}
                                                        href={link.href}
                                                    >
                                                        {link.text}
                                                    </Dropdown.Link>
                                                )
                                            })
                                        }
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="visible lg:hidden search-bar flex items-center space-x-2 justify-center mt-4">
                            <input
                            type="text"
                            className="form-control text-black px-4 py-2 lg:w-[300px] rounded-lg border border-gray-300"
                            placeholder="Search"
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
                        </div>
                    </div>
                    <Header userId={user.id}/>
                    <main className='p-6 w-full'>
                        {children}
                    </main>
                </section>
            </section>
        </div>
    );
}