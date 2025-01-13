import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { RiHome2Line, RiCalendarTodoLine, RiMedicineBottleLine } from "react-icons/ri";
import { AiOutlineSkin } from "react-icons/ai";
import { TbReportMedical, TbTools } from "react-icons/tb";
import { MdOutlineInventory2 } from "react-icons/md";
import { PiAddressBookBold } from "react-icons/pi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuMessagesSquare } from "react-icons/lu";
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from "react-hot-toast";
import { closeSidebar } from '../reducers/sidebarSlice';

const Sidebar = React.lazy(() => import("@/Components/Sidebars/Sidebar"));
const Header = React.lazy(() => import("@/Components/Headers/Header"));

const AdminLayout = ({ children }) => {
    const { auth: { user }, url } = usePage().props;
    const open = useSelector((state) => state.sidebar.open);
    const dispatch = useDispatch();

    const redirectRole = user.role === "Administration" || user.role === "BHW"
        ? "Administration" : user.role === "BHW" ? "BHW" : "Patient";

    const linkOnClick = () => {
        if (window.innerWidth < 768) {
            dispatch(closeSidebar());
        }
    };

    const [dropdownState, setDropdownState] = useState({});

    const handleDropdownToggle = (index) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const curLinks = user.role === "Administration" ? [
        { icon: <RiHome2Line />, text: "Dashboard", href: "#", route: "/admin/dashboard", sublinks: [] },
        { 
            icon: <AiOutlineSkin className='mr-4'/>, 
            text: "Accounts", 
            href: route('admin.accounts.admin'), 
            route: '/admin/accounts',
            sublinks: [
                { text: "Administrations", href: route('admin.accounts.admin'), route: '/admin/accounts/admin' },
                { text: "Doctors", href: route('admin.accounts.doctor'), route: '/admin/accounts/doctor' },
                { text: "Bhws", href: route('admin.accounts.bhw'), route: '/admin/accounts/bhw' },
                { text: "Patients", href: route('admin.accounts.patient'), route: '/admin/accounts/patient' },
            ] 
        },
        { 
            icon: <PiAddressBookBold className='mr-4'/>, 
            text: "Medical", 
            href: route('admin.medical.history'), 
            route: '/admin/medical',
            sublinks: [
                { text: "History", href: route('admin.medical.history'), route: '/admin/medical/history' },
                { text: "Records", href: route('admin.medical.records'), route: '/admin/medical/records' },
            ] 
        },
        { icon: <TbReportMedical />, text: "Medicines", href: route('admin.medicines'), route: '/admin/medicines', sublinks: [] },
        { icon: <MdOutlineInventory2 />, text: "Inventories", href: route('admin.inventories'), route: '/admin/inventories', sublinks: [] },
        { 
            icon: <RiCalendarTodoLine className='mr-4'/>, 
            text: "Scheduling", 
            href: route('admin.schedules'), 
            route: '/admin/schedules',
            sublinks: [
                { text: "Calendar", href: route('admin.schedules'), route: '/admin/schedules/calendar' },
                { text: "Appointment", href: route('admin.appointments'), route: '/admin/schedules/appointment' },
            ] 
        },
        { icon: <RiMedicineBottleLine />, text: "Medicine Requester", href: route('admin.medicine.requester'), route: '/admin/medicine/requester', sublinks: [] },
        { icon: <TbTools />, text: "Activities", href: route('admin.activities'), route: '/admin/activities', sublinks: [] },
        { 
            icon: <HiOutlineDocumentReport className='mr-4'/>, 
            text: "Report", 
            href: route('admin.show.data.analysis'), 
            route: '/admin/reports',
            sublinks: [
                { text: "Data", href: route('admin.show.data.analysis'), route: '/admin/reports/data' },
                { text: "Referral", href: route('admin.referrals'), route: '/admin/reports/referral' },
                { text: "Prescription", href: route('admin.prescriptions'), route: '/admin/reports/prescription' },
                { text: "Medicine", href: route('admin.reports.medicine'), route: '/admin/reports/medicine' },
                { text: "Inventory", href: route('admin.reports.inventory'), route: '/admin/reports/inventory' },
                { text: "Appointment", href: route('admin.reports.appointment'), route: '/admin/reports/appointment' },
                { text: "Activity", href: route('admin.reports.activity'), route: '/admin/reports/activity' },
                { text: "Medicine Requester", href: route('admin.reports.medicine.request'), route: '/admin/reports/medicine/requester' },
                { text: "Administrator", href: route('admin.reports.administrator.account'), route: '/admin/reports/administrator/account' },
                { text: "Doctor", href: route('admin.reports.doctor.account'), route: '/admin/reports/doctor/account' },
                { text: "Patient", href: route('admin.reports.patient.account'), route: '/admin/reports/patient/account' },
                { text: "Bwh", href: route('admin.reports.bhw.account'), route: '/admin/reports/bhw/account' },
                { text: "Medical Certificate", href: route('admin.show.medical.certificate'), route: '/admin/reports/medical/certificate' },
            ]
        },
        { icon: <LuMessagesSquare />, text: "Message", href: route('admin.messages'), route: '/admin/messages', sublinks: [] }
    ] : [
        { icon: <RiHome2Line />, text: "Dashboard", href: "#", route: "/bhw/dashboard", sublinks: [] },
        { 
            icon: <PiAddressBookBold className='mr-4'/>, 
            text: "Medical", 
            href: route('bhw.medical.history'), 
            route: '/bhw/medical',
            sublinks: [
                { text: "History", href: route('bhw.medical.history'), route: '/bhw/medical/history' },
                { text: "Records", href: route('bhw.medical.records'), route: '/bhw/medical/records' },
            ] 
        },
        { icon: <TbReportMedical />, text: "Medicines", href: route('bhw.medicines'), route: '/bhw/medicines', sublinks: [] },
        { icon: <MdOutlineInventory2 />, text: "Inventories", href: route('bhw.inventories'), route: '/bhw/inventories', sublinks: [] },
        { 
            icon: <RiCalendarTodoLine className='mr-4'/>, 
            text: "Scheduling", 
            href: route('bhw.schedules'), 
            route: '/bhw/schedules',
            sublinks: [
                { text: "Calendar", href: route('bhw.schedules'), route: '/bhw/schedules/calendar' },
                { text: "Appointment", href: route('bhw.appointments'), route: '/bhw/schedules/appointment' },
            ] 
        },
        { icon: <TbTools />, text: "Activities", href: route('bhw.activities'), route: '/bhw/activities', sublinks: [] },
        { 
            icon: <HiOutlineDocumentReport className='mr-4'/>, 
            text: "Report", 
            href: route('bhw.show.data.analysis'), 
            route: '/bhw/reports',
            sublinks: [
                { text: "Data", href: route('bhw.show.data.analysis'), route: '/bhw/reports/data' },
                { text: "Referral", href: route('bhw.referrals'), route: '/bhw/reports/referral' },
                { text: "Prescription", href: route('bhw.prescriptions'), route: '/bhw/reports/prescription' },
                { text: "Medicine", href: route('bhw.reports.medicine'), route: '/bhw/reports/medicine' },
                { text: "Inventory", href: route('bhw.reports.inventory'), route: '/bhw/reports/inventory' },
                { text: "Appointment", href: route('bhw.reports.appointment'), route: '/bhw/reports/appointment' },
                { text: "Activity", href: route('bhw.reports.activity'), route: '/bhw/reports/activity' },
                { text: "Medicine Requester", href: route('bhw.reports.medicine.request'), route: '/bhw/reports/medicine/requester' },
                { text: "Administrator", href: route('bhw.reports.administrator.account'), route: '/bhw/reports/administrator/account' },
                { text: "Doctor", href: route('bhw.reports.doctor.account'), route: '/bhw/reports/doctor/account' },
                { text: "Patient", href: route('bhw.reports.patient.account'), route: '/bhw/reports/patient/account' },
                { text: "Bwh", href: route('bhw.reports.bhw.account'), route: '/bhw/reports/bhw/account' },
                { text: "Medical Certificate", href: route('bhw.show.medical.certificate'), route: '/bhw/reports/medical/certificate' },
            ]
        },
        { icon: <LuMessagesSquare />, text: "Message", href: route('bhw.messages'), route: '/bhw/messages', sublinks: [] }
    ];

    return (
        <>
            <Sidebar user={user}>
                <div className="mt-4 overflow-y-auto max-h-screen">
                    {curLinks.map((link, idx) => {
                        const isActive = url === link.route || link.sublinks.some((sub) => sub.route === url);
                        return (
                            <div key={`link-${idx}`}>
                                {link.sublinks.length > 0 ? (
                                    <div className="mb-1 group">
                                        <button
                                            onClick={() => handleDropdownToggle(idx)}
                                            className="flex items-center w-full py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md focus:outline-none"
                                        >
                                            {link.icon}
                                            <span className="text-lg">{link.text}</span>
                                            <i
                                                className={`ri-arrow-right-s-line ml-auto transform ${dropdownState[idx] ? "rotate-90" : ""}`}
                                            ></i>
                                        </button>
                                        {dropdownState[idx] && (
                                            <div className="pl-7 mt-2">
                                                {link.sublinks.map((sub, subIdx) => (
                                                    <Link
                                                        href={sub.href}
                                                        key={`sub-${subIdx}`}
                                                        className="text-gray-300 text-lg flex items-center hover:text-gray-100 mb-4"
                                                    >
                                                        <span className="before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3"></span>
                                                        {sub.text}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        onClick={linkOnClick}
                                        href={link.href}
                                        className={`flex items-center gap-4 px-4 py-2 text-white ${
                                            url === link.route ? 'text-white' : 'hover:text-white'
                                        } transition`}
                                    >
                                        {link.icon}
                                        <span>{link.text}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Sidebar>

            <main className={`w-full ${open ? 'md:ml-64 md:w-[calc(100%-256px)]' : ''} bg-gray-50 min-h-screen transition-all main`}>
                <Header userId={user.id} />
                <div className="p-6">
                    <Toaster position="top-right" reverseOrder={false} />
                    {children}
                </div>
            </main>
        </>
    );
};

export default AdminLayout;
