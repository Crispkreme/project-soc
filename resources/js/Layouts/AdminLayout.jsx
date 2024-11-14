import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import SidebarItem from '../Components/Sidebars/SidebarItem';
import { RiHome2Line, RiCalendarTodoLine } from "react-icons/ri";
import { AiOutlineSkin } from "react-icons/ai";
import { TbReportMedical, TbTools } from "react-icons/tb";
import { MdOutlineInventory2 } from "react-icons/md";
import { PiAddressBookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { useSelector } from 'react-redux';

const Sidebar = React.lazy(() => import("../Components/Sidebars/Sidebar"));
const Header = React.lazy(() => import("../Components/Headers/Header"));

const AdminLayout = ({ children }) => {

    const user = usePage().props.auth.user;
    const open = useSelector(state => state.sidebar.open);
    return (
        <>
            <Sidebar user={user}>
                <ul className="mt-4">
                    <SidebarItem icon={RiHome2Line} label="Dashboard" link="#" />
                    <SidebarItem
                        icon={AiOutlineSkin}
                        label="Accounts"
                        dropdownItems={[
                            { label: 'Administrations', link: route('admin.accounts.admin') },
                            { label: 'Doctors', link: route('admin.accounts.doctor') },
                            { label: 'Bhws', link: route('admin.accounts.bhw') },
                            { label: 'Patients', link: route('admin.accounts.patient') },
                        ]}
                    />
                    <SidebarItem
                        icon={PiAddressBookBold}
                        label="Medical"
                        dropdownItems={[
                            { label: 'History', link: route('admin.medical.history') },
                            { label: 'Records', link: route('admin.medical.records') },
                        ]}
                    />
                    <SidebarItem icon={TbReportMedical} label="Medicines" link={route('admin.medicines')} />
                    <SidebarItem icon={MdOutlineInventory2} label="Inventories" link={route('admin.inventories')} />
                    <SidebarItem
                        icon={RiCalendarTodoLine}
                        label="Scheduling"
                        dropdownItems={[
                            { label: 'Calendar', link: route('admin.schedules') },
                            { label: 'Appointment', link: route('admin.appointments') },
                        ]}
                    />
                    <SidebarItem icon={TbTools} label="Activities" link="#" />
                    <SidebarItem icon={VscGraph} label="Data" link="#" />
                </ul>
            </Sidebar>

            <main className={`w-full ${open ? 'md:ml-64 md:w-[calc(100%-256px)]' : ''} bg-gray-50 min-h-screen transition-all main`}>
            
                <Header userId={user.id} />

                <div className="p-6">
                    {children}
                </div>
                
            </main>
        </>
    )
}

export default AdminLayout
