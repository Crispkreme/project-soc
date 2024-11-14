import React, { useState } from "react";
import Profile from "./Profile";
import Breadcrumb from "./Breadcrumb";
import NotificationList from "./NotificationList";
import MessageList from "./MessageList";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaBars, FaX } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar, openSidebar } from "../../reducers/sidebarSlice";
import { usePage } from '@inertiajs/react';

const notificationsData = [
    {
        title: 'New order',
        message: 'from a user',
        image: 'https://placehold.co/32x32',
        link: '#'
    },
    {
        title: 'Payment received',
        message: 'from a customer',
        image: 'https://placehold.co/32x32',
        link: '#'
    },
];

const messagesData = [
    {
        sender: 'John Doe',
        content: 'Hello there!',
        image: 'https://placehold.co/32x32',
        link: '#'
    },
    {
        sender: 'Jane Smith',
        content: 'New updates available.',
        image: 'https://placehold.co/32x32',
        link: '#'
    },
];

const Header = ({ userId }) => {

    const user = usePage().props.auth.user;
    const [isHeaderNotificationsOpen, setIsHeaderNotificationsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        setIsMessagesOpen(false);
    };

    const toggleHeaderNotifications = () => {
        setIsHeaderNotificationsOpen(!isHeaderNotificationsOpen);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
    };

    const toggleMessages = () => {
        setIsMessagesOpen(!isMessagesOpen);
        setIsNotificationsOpen(false);
    };

    const open = useSelector(state => state.sidebar.open);
    const dispatch = useDispatch();

    const buttonOnClick = () => {   
        if(open) {
            dispatch(closeSidebar());
        } else if (!open) {
            dispatch(openSidebar());
        }
    }

    return (
        <div className="py-2 px-6 bg-white flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
            <button onClick={buttonOnClick} type="button" className="text-lg text-gray-600 sidebar-toggle">
                {!open ? <FaBars /> : <FaX />}
            </button>

            <Breadcrumb />

            <ul className="ml-auto flex items-center relative">
                <li>
                    <button 
                        type="button" 
                        className="dropdown-toggle text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
                        onClick={toggleHeaderNotifications}
                    >
                        <IoMdNotificationsOutline />
                    </button>

                    <div className={`dropdown-menu shadow-md shadow-black/5 z-30 ${isHeaderNotificationsOpen ? 'block' : 'hidden'} max-w-xs w-full bg-white rounded-md border border-gray-100 absolute right-0`}>
                        <div className="flex items-center px-4 pt-4 border-b border-b-gray-100 notification-tab">
                            <button 
                                type="button" 
                                className="text-gray-400 font-medium text-[13px] hover:text-gray-600 border-b-2 border-b-transparent mr-4 pb-1 active"
                                onClick={toggleNotifications}
                            >
                                Notifications
                            </button>
                            <button 
                                type="button" 
                                className="text-gray-400 font-medium text-[13px] hover:text-gray-600 border-b-2 border-b-transparent mr-4 pb-1"
                                onClick={toggleMessages}
                            >
                                Messages
                            </button>
                        </div>
                        <div className="my-2">
                            {isNotificationsOpen && <NotificationList notifications={notificationsData} />}
                            {isMessagesOpen && <MessageList messages={messagesData} />}
                        </div>
                    </div>
                </li>
                <Profile userId={userId} username={user.username}/>
            </ul>
        </div>
    );
};

export default Header;
