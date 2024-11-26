import React from 'react';
import { usePage } from '@inertiajs/react';
import SidebarItem from '../Components/Sidebars/SidebarItem';
import { RiHome2Line, RiCalendarTodoLine } from "react-icons/ri";
import { AiOutlineSkin } from "react-icons/ai";
import { TbReportMedical, TbTools } from "react-icons/tb";
import { RiHospitalLine } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import { PiAddressBookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { GoChecklist } from "react-icons/go";
import { useSelector } from 'react-redux';

const Sidebar = React.lazy(() => import("@/Components/Sidebars/Sidebar"));
const Header = React.lazy(() => import("@/Components/Headers/Header"));

const AdminLayout = ({ children }) => {
    const user = usePage().props.auth.user;
    const open = useSelector(state => state.sidebar.open);

    const adminMenu = (
        <>
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
            <SidebarItem icon={TbTools} label="Activities" link={route('admin.activities')} />
            <SidebarItem icon={TbTools} label="Medicine Requester" link={route('admin.medicine.requester')} />
            <SidebarItem icon={RiHospitalLine} label="Referral" link={route('admin.referrals')} />
            <SidebarItem icon={GoChecklist} label="Prescription" link={route('admin.prescriptions')} />
            <SidebarItem icon={VscGraph} label="Data" link="#" />
        </>
    );

    const userMenu = (
        <>
            <SidebarItem icon={RiHome2Line} label="Dashboard" link="#" />
            <SidebarItem
                icon={PiAddressBookBold}
                label="Medical"
                dropdownItems={[
                    { label: 'History', link: route('bhw.medical.history') },
                    { label: 'Records', link: route('bhw.medical.records') },
                ]}
            />
            <SidebarItem icon={TbReportMedical} label="Medicines" link={route('bhw.medicines')} />
            <SidebarItem icon={MdOutlineInventory2} label="Inventories" link={route('bhw.inventories')} />
            <SidebarItem
                icon={RiCalendarTodoLine}
                label="Scheduling"
                dropdownItems={[
                    { label: 'Calendar', link: route('bhw.schedules') },
                    { label: 'Appointment', link: route('bhw.appointments') },
                ]}
            />
            <SidebarItem icon={TbTools} label="Activities" link={route('bhw.activities')} />
            <SidebarItem icon={RiHospitalLine} label="Referral" link={route('bhw.referrals')} />
            <SidebarItem icon={GoChecklist} label="Prescription" link={route('bhw.prescriptions')} />
            <SidebarItem icon={VscGraph} label="Data" link="#" />
        </>
    );

    return (
        <>
            <Sidebar user={user}>
                <ul className="mt-4">
                    {user.role === "Administration" ? adminMenu : userMenu}
                </ul>
            </Sidebar>

            <main className={`w-full ${open ? 'md:ml-64 md:w-[calc(100%-256px)]' : ''} bg-gray-50 min-h-screen transition-all main`}>
            
                <Header userId={user.id} />

                <div className="p-6">
                    {children}
                </div>
                
            </main>
        </>
    );
};

export default AdminLayout;
