import React from 'react';
import { RiHome2Line, RiCalendarTodoLine } from "react-icons/ri";
import { AiOutlineSkin } from "react-icons/ai";
import { TbReportMedical, TbTools } from "react-icons/tb";
import { MdOutlineInventory2 } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import SidebarItem from './SidebarItem';

const Sidebar = () => {

    return (
        <>
            <div className="fixed left-0 top-0 w-64 h-full bg-gray-900 p-4 z-50 sidebar-menu transition-transform">
                <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
                    <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover" />
                    <span className="text-lg font-bold text-white ml-3">Logo</span>
                </a>
                <ul className="mt-4">
                    <SidebarItem icon={RiHome2Line} label="Dashboard" link="#" />
                    <SidebarItem icon={AiOutlineSkin} label="Accounts" link={route('admin.accounts')} />
                    {/* <SidebarItem
                        icon={AiOutlineSkin}
                        label="Accounts"
                        dropdownItems={[
                        { label: 'Active order', link: '#' },
                        { label: 'Completed order', link: '#' },
                        { label: 'Canceled order', link: '#' },
                        ]}
                    /> */}
                    {/* <SidebarItem
                        icon={TbReportMedical}
                        label="Medical"
                        dropdownItems={[
                        { label: 'Active order', link: '#' },
                        { label: 'Completed order', link: '#' },
                        { label: 'Canceled order', link: '#' },
                        ]}
                    /> */}
                    <SidebarItem icon={TbReportMedical} label="Medicines" link={route('admin.medicines')} />
                    <SidebarItem icon={MdOutlineInventory2} label="Inventories" link="#" />
                    <SidebarItem icon={RiCalendarTodoLine} label="Scheduling" link="#" />
                    <SidebarItem icon={TbTools} label="Activities" link="#" />
                    <SidebarItem icon={VscGraph} label="Data" link="#" />
                </ul>
            </div>
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay"></div>
        </>
    )
}

export default Sidebar
