import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { PiAddressBookBold } from 'react-icons/pi';
import { RiCalendarTodoLine } from 'react-icons/ri';
import Dropdown from '@/Components/Inputs/Dropdown';
import { FaGripLines } from 'react-icons/fa';

const logo = "/assets/svg/logo.svg";
const header = "/assets/svg/header.svg";

export default function PatientLayout({children}) {

    const {url, component} = usePage();
    const user = usePage().props.auth.user;
    return (
        <div className='min-h-screen h-full flex flex-col'>
            <div className="header bg-cover p-5 text-white text-center" style={{ backgroundImage: `url(${header})`, height: '109px' }}>
                <div className="flex justify-between items-center">
                    <Link href={route('patient.dashboard')}>
                        <img src={logo} alt="Logo" className="w-24" />
                    </Link>
                    <div className="search-bar flex items-center space-x-2">
                        <input
                        type="text"
                        className="form-control text-black px-4 py-2 w-[300px] rounded-lg border border-gray-300"
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
            </div>
    
            <section className='flex h-full grow'>
                <div className="flex flex-col flex-[1_0_15%] bg-secondary-bg text-center flex justify-center">
                    {
                        [
                            {icon: <RiCalendarTodoLine />,text: "Book Appointments", href: route('patient.book.appointments'), route: '/patient/book/appointments', sublinks: []},
                            {icon: <RiCalendarTodoLine />,text: "Community", href: route('patient.show.communities.practitioner'), route: '/patient/show/communities/practitioner',
                                sublinks: [
                                    {text: "Patients", href: route('patient.show.communities.practitioner'), route: '/patient/show/communities'},
                                    {text: "Practitioners", href: route('patient.show.communities.practitioner'), route: '/patient/show/communities/practitioner'},
                                    {text: "BHWs", href: route('patient.show.communities.bhw'), route: '/patient/show/communities/bhw'},
                                ]
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
                        ].map( (link, idx) => {
                            const active = url === link.route | link.sublinks.filter( link => link.route === url).length > 0;
                            return (
                                <>
                                <Link key={idx} href={link.href} className={`flex items-center gap-4 px-4 py-2 ${url === link.route ? 'text-white' : 'hover:text-white'} transition`}>
                                    {link.icon}
                                    <span>{link.text}</span>
                                </Link>
                                <ul className={`${active ? 'visible' : 'hidden'}`}>
                                {
                                    link.sublinks.map( (sub, idx) => {
                                        return (
                                            <li key={idx}>
                                                <Link key={idx} href={sub.href} className={`flex items-center gap-4 px-8 py-2 ${url === sub.route ? 'text-white' : 'hover:text-white'} transition`}>
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
                
                <main className='p-6 flex-[1_0_85%]'>
                    {children}
                </main>
            </section>
        </div>
    );
}