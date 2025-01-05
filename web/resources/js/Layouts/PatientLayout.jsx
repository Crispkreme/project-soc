import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { PiAddressBookBold } from 'react-icons/pi';
import { RiCalendarTodoLine } from 'react-icons/ri';
import Dropdown from '@/Components/Inputs/Dropdown';
import { FaGripLines } from 'react-icons/fa';
import Sidebar from '../Components/Sidebars/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { closeSidebar } from '../reducers/sidebarSlice';
import { LuBookMarked } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { BsJournalMedical } from "react-icons/bs";
import { MdOutlineDashboard } from "react-icons/md";
import { LuMessagesSquare } from "react-icons/lu";

const logo = "/assets/svg/logo.svg";
const header = "/assets/svg/header.svg";
const Profile = React.lazy(() => import("../Components/Headers/Profile"));

export default function PatientLayout({ children }) {

    const {url, component} = usePage();
    const user = usePage().props.auth.user;
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userDetail, setUserDetail] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const open = useSelector(state => state.sidebar.open);
    const dispatch = useDispatch();

    const redirectRole = user.role === "Patient" || user.role === "BHW" ? "Practitioner" : user.role === "Practitioner" ? "Patient" : "BHW";
    const linkOnClick = () => window.innerWidth < 768 ? dispatch(closeSidebar()) : null;

    const curLinks = user.role === "Patient" ? [
        {icon: <MdOutlineDashboard />,text: "Dashboard", href: route(`patient.dashboard`), route: '/patient/dashboard', sublinks: []},
        {icon: <RiCalendarTodoLine />,text: "Book Appointments", href: route(`patient.book.appointments`), route: '/patient/book/appointments', sublinks: []},
        {icon: <RiCalendarTodoLine />,text: "Medicine Requester", href: route(`patient.medicine.requester`), route: '/patient/medicine/requester', sublinks: []},
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
                // {text: "Data Analysis Reports", href: route('patient.show.data.analysis'), route: '/patient/show/data/analysis'},
                {text: "BHW Activities", href: route('patient.show.bhw.activities'), route: '/patient/show/bhw/activities'},
            ]
        },
        {icon: <PiAddressBookBold />,text: "My Records", href: route('patient.show.record.medicals'), route: '/patient/show/record/medicals',
            sublinks: [
                {text: "My Medical Records", href: route('patient.show.record.medicals'), route: '/patient/show/record/medicals'},
                {text: "My Medical History", href: route('patient.show.record.histories'), route: '/patient/show/record/histories'},
                {text: "Medical Certificate", href: route('patient.show.medical.certificate'), route: '/patient/show/medical/certificate'},
            ]
        },
        {icon: <LuBookMarked />,text: "Logs", href: route(`patient.logs`), route: '/patient/logs', sublinks: []},
        {icon: <LuMessagesSquare />,text: "Message", href: route(`patient.messages`), route: '/patient/messages', sublinks: []},
    ] : [
        {icon: <MdOutlineDashboardCustomize />,text: "Dashboard", href: route(`practitioner.dashboard`), route: '/practitioner/dashboard', sublinks: []},
        {icon: <MdOutlineDashboardCustomize />,text: "Appointment", href: route(`practitioner.appointments`), route: '/practitioner/appointments', sublinks: []},
        {icon: <PiAddressBookBold />,text: "Schedules", href: route('practitioner.book.appointments'), route: '/practitioner/book/appointments',
            sublinks: [
                {text: "Schedules", href: route('practitioner.book.appointments'), route: '/practitioner/book/appointments'},
                {text: "Patient Booked", href: route('practitioner.book.appointments.booked'), route: '/practitioner/book/appointments/booked'},
            ]
        },
        {icon: <BsJournalMedical />,text: "Medical Record", href: route(`practitioner.dashboard`), route: '/practitioner/dashboard', 
            sublinks: [
                {text: "Medical Record", href: route('practitioner.medical.records'), route: '/practitioner/medical/records'},
                {text: "Medical History", href: route('practitioner.medical.history'), route: '/practitioner/medical/history'},
            ].filter(Boolean)
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
                {text: "History", href: route('practitioner.medical.history'), route: '/practitioner/medical/history'},
                {text: "Appointment", href: route('practitioner.show.report.appointment'), route: '/practitioner/show/reports/appointment'},
                {text: "Medical Available", href: route('practitioner.show.report.medicine.available'), route: '/practitioner/show/reports/medicine/available'},
                {text: "Data Analytics", href: route('practitioner.show.report.analytics'), route: '/practitioner/show/reports/analytics'},
                {text: "Released", href: route('practitioner.show.report.released'), route: '/practitioner/show/reports/released'},
                {text: "Medical Certificate", href: route('practitioner.show.medical.certificate'), route: '/practitioner/show/medical/certificate'},
            ]
        },
        {icon: <LuMessagesSquare />,text: "Message", href: route(`practitioner.messages`), route: '/practitioner/messages', sublinks: []},
    ];

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(route('patient.profile.details', user.id));
                const data = await response.json();
                setUserDetail(data.userDetail);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [user.id]);

    useEffect(() => {
        async function fetchAvatar() {
            try {
                const response = await axios.get(`/user/avatar/${user.username}`);
                setAvatar(response.data.avatar);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        }
        fetchAvatar();
    }, [user.username]);

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length >= 3) {
            setIsSearching(true);
            try {
                const response = await axios.get(`/medicines/search`, { params: { query } });
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching medicines:", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };
    
    return (
        <div className='min-h-screen h-full flex flex-col'>
            <section className='flex h-full lg:grow flex-wrap'>

                <Sidebar user={user}>
                    <div className={`overflow-y-auto h-full mt-4 transition-all text-center bg-white flex py-4 flex-col justify-start rounded-2xl`}>
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
                        
                        <Profile userId={user.id} username={user.username}/>

                        <div className="visible lg:hidden search-bar flex items-center space-x-2 justify-center mt-4">
                            <div className="relative w-full lg:w-[300px]">
                                <input
                                    type="text"
                                    className="form-control text-black px-4 py-2 rounded-lg border w-[500px] border-gray-300 pl-10"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <IoSearch />
                                </span>
                            </div>
                            {isSearching && (
                                <div className="absolute bg-white border border-gray-300 w-[500px] z-10 mt-1">
                                    <div className="text-center py-2">Loading...</div>
                                </div>
                            )}
                            {searchResults.length > 0 && !isSearching && (
                                <div className="absolute bg-white border border-gray-300 w-[500px] z-10 mt-1">
                                    <ul>
                                        {searchResults.map((medicine, index) => (
                                            
                                            <li key={index} className="py-2 px-4 text-sm cursor-pointer hover:bg-gray-100 text-black">
                                                {medicine}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                    
                    <main className='p-6 w-full'>
                        {children}
                    </main>
                </section>
            </section>
        </div>
    );
}