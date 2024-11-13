import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { PiAddressBookBold } from 'react-icons/pi';
import { RiCalendarTodoLine, RiCloseFill, RiMenuFill } from 'react-icons/ri';
import Dropdown from '@/Components/Inputs/Dropdown';
import { FaGripLines } from 'react-icons/fa';

const logo = "/assets/svg/logo.svg";
const header = "/assets/svg/header.svg";

export default function PatientLayout({children}) {

    const {url, component} = usePage();
    const user = usePage().props.auth.user;
    const [state, setState] = useState({
        open: false,
        visible: false,
    });

    const openOnClick = () => setState(prev => ({...prev, open: !state.open}));

    const redirectRole = user.role === "Patient" || user.role === "BHW" ? "Practitioner" : user.role === "Practitioner" ? "Patient" : "BHW" 

    const target = useRef(null);

    useEffect(() => {
        
        if(target.current) {
            target.current.addEventListener("transitionend", () => {
                console.log(state.open);
                setState(prev => ({...prev, visible: prev.open}));
            });
        }

        return () => {
            if(target.current) target.current.removeEventListener("transitionend");
        }
    },[target]);

    return (
        <div className='min-h-screen h-full flex flex-col'>
            <section className='flex h-full lg:grow flex-wrap'>
                <div className={`${state.open ? 'flex-[1_0_100%] lg:flex-[1_0_20%]' : 'flex-[1_0_0%]'} flex flex-col gap-24 bg-secondary-bg p-2 transition-all`}>
                    <div className='flex justify-between'>
                        <Link className={`${state.open ? 'opacity-1' : 'opacity-1 lg:opacity-0'} ${state.visible || state.open ? 'visible' : 'lg:block lg:visible  '} transition-all`} href={route('patient.dashboard')}>
                            <img src={logo} alt="Logo" className="w-20" />
                        </Link>
                        <button onClick={openOnClick}>
                            {state.open ? <RiCloseFill size={24}/> : <RiMenuFill size={24}/>}
                        </button>
                    </div>
                    <div ref={target} className={`${state.open ? 'opacity-1' : 'opacity-0'} ${state.visible || state.open ? 'visible' : 'hidden lg:block lg:visible '}  transition-all text-center bg-white flex py-4 flex-col justify-center rounded-2xl`}>
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
                            [
                                {icon: <RiCalendarTodoLine />,text: "Book Appointments", href: route('patient.book.appointments'), route: '/patient/book/appointments', sublinks: []},
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
                            ].map( (link, idx) => {
                                const active = url === link.route | link.sublinks.filter( link => link.route === url).length > 0;
                                return (
                                    <>
                                    <Link key={idx} href={link.href} className={`flex items-center gap-4 px-4 py-2 ${url === link.route ? 'text-primary-bg' : 'hover:text-primary-bg'} transition`}>
                                        {link.icon}
                                        <span>{link.text}</span>
                                    </Link>
                                    <ul className={`${active && (state.visible || state.open) ? 'visible' : 'hidden'}`}>
                                    {
                                        link.sublinks.map( (sub, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <Link key={idx} href={sub.href} className={`flex items-center gap-4 px-8 py-2 ${url === sub.route ? 'text-primary-bg' : 'hover:text-primary-bg'} transition`}>
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
                </div>
                
                <section className='flex flex-col flex-[0_0_100%] lg:flex-[1_0_80%]'>
                    <div className="header bg-cover p-5 text-white text-center h-full lg:h-[109px]" style={{ backgroundImage: `url(${header})` }}>
                        <div className="flex justify-between items-center">
                            <Link href={route('patient.dashboard')}>
                                <img src={logo} alt="Logo" className="w-16 lg:w-24" />
                            </Link>
                            <div className="hidden lg:block lg:visible search-bar flex items-center space-x-2">
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
                    <main className='p-6 flex-[1_0_85%]'>
                        {children}
                    </main>
                </section>
            </section>
        </div>
    );
}