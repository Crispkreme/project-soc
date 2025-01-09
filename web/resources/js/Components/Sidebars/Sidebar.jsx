import React from 'react';
import { FaBars } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar, openSidebar } from '../../reducers/sidebarSlice';
import { usePage } from '@inertiajs/inertia-react';

const Sidebar = ({children, user}) => {

    const open = useSelector((state) => state.sidebar.open);
    const dispatch = useDispatch();

    const buttonOnClick = () => {
        if(open) {
            dispatch(closeSidebar());
        } else if (!open) {
            dispatch(openSidebar());
        }
    }

    const admin = user.role === "Administration" || user.role === "BHW";
    return (
        <>
            <div className={`fixed left-0 top-0 ${open ? 'w-64 p-4 ' : 'p-4 md:p-0'} ${open ? 'h-full' : ''} bg-gray-900  z-50 sidebar-menu transition-transform`}>
                <div className={`flex ${admin ? 'justify-between' : 'justify-end'} items-center ${open ? 'border-b border-b-gray-800 pb-4' : ''} transition-all`}>
                    { admin && (
                        <a href="#" className={`flex ${open ? 'visible' : 'hidden'} items-center `}>
                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover" />
                            <span className="text-lg font-bold text-white ml-3">Logo</span>
                        </a>
                    )}
                    <button onClick={buttonOnClick} className='md:hidden'>
                        {!open ? <FaBars color='white' /> : <FaX color='white' />}
                    </button>
                </div>
                <div className={`${open ? 'visible' : 'hidden'} h-full`}>
                    {children}
                </div>
            </div>
            <div className={`${open ? 'fixed' : ''} top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay`}></div>
        </>
    )
}

export default Sidebar
