import React from 'react';
import { usePage } from '@inertiajs/react';
import SidebarItem from '../Components/Sidebars/SidebarItem';
import { RiHome2Line, RiCalendarTodoLine } from "react-icons/ri";
import { AiOutlineSkin } from "react-icons/ai";
import { TbReportMedical, TbTools } from "react-icons/tb";
import { MdOutlineInventory2 } from "react-icons/md";
import { PiAddressBookBold } from "react-icons/pi";
import { useSelector } from 'react-redux';
import { HiOutlineDocumentReport } from "react-icons/hi";
import { RiMedicineBottleLine } from "react-icons/ri";
import { Toaster } from "react-hot-toast";
import { LuMessagesSquare } from "react-icons/lu";

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
            <SidebarItem icon={RiMedicineBottleLine} label="Medicine Requester" link={route('admin.medicine.requester')} />
            <SidebarItem icon={TbTools} label="Activities" link={route('admin.activities')} />
            <SidebarItem
                icon={HiOutlineDocumentReport}
                label="Report"
                dropdownItems={[
                    { label: 'Data', link: route('admin.show.data.analysis') },
                    { label: 'Referral', link: route('admin.referrals') },
                    { label: 'Referral', link: route('admin.referrals') },
                    { label: 'Prescription', link: route('admin.prescriptions') },
                    { label: 'Medicine', link: route('admin.reports.medicine') },
                    { label: 'Inventory', link: route('admin.reports.inventory') },
                    { label: 'Appointment', link: route('admin.reports.appointment') },
                    { label: 'Activity', link: route('admin.reports.activity') },
                    { label: 'Medicine Requester', link: route('admin.reports.medicine.request') },
                    { label: 'Administrator', link: route('admin.reports.administrator.account') },
                    { label: 'Doctor', link: route('admin.reports.doctor.account') },
                    { label: 'Patient', link: route('admin.reports.patient.account') },
                    { label: 'Bwh', link: route('admin.reports.bhw.account') },
                    { label: 'Medical Certificate', link: route('admin.show.medical.certificate') },

                ]}
            />
            <SidebarItem icon={LuMessagesSquare} label="Message" link={route('admin.messages')} />
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
            <SidebarItem
                icon={HiOutlineDocumentReport}
                label="Report"
                dropdownItems={[
                    { label: 'Data', link: route('bhw.show.data.analysis') },
                    { label: 'Referral', link: route('bhw.referrals') },
                    { label: 'Prescription', link: route('bhw.prescriptions') },
                    { label: 'Medicine', link: route('bhw.reports.medicine') },
                    { label: 'Inventory', link: route('bhw.reports.inventory') },
                    { label: 'Appointment', link: route('bhw.reports.appointment') },
                    { label: 'Activity', link: route('bhw.reports.activity') },
                    { label: 'Medicine Requester', link: route('bhw.reports.medicine.request') },
                    { label: 'Administrator', link: route('bhw.reports.administrator.account') },
                    { label: 'Doctor', link: route('bhw.reports.doctor.account') },
                    { label: 'Patient', link: route('bhw.reports.patient.account') },
                    { label: 'Bwh', link: route('bhw.reports.bhw.account') },
                    { label: 'Medical Certificate', link: route('bhw.show.medical.certificate') },
                ]}
            />
            <SidebarItem icon={LuMessagesSquare} label="Message" link={route('bhw.messages')} />
        </>
    );

    return (
        <>
            <Sidebar user={user}>
                <div className="mt-4 overflow-y-auto max-h-screen"> {/* Added scroll functionality */}
                    <ul>
                        {user.role === "Administration" ? adminMenu : userMenu}
                    </ul>
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
