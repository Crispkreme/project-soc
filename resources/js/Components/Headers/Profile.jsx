import React, { useState } from "react";
import ProfileItem from './ProfileItem';

const Profile = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const menuItems = [
        { label: 'Profile', link: route('admin.view.profile', userId) },
        { label: 'Settings', link: '/settings' },
        { label: 'Logout', link: '/logout' },
    ];

    return (
        <li className="dropdown ml-3 relative">
            <button
                type="button"
                className="dropdown-toggle flex items-center"
                onClick={toggleDropdown}
            >
                <img
                    src="https://placehold.co/32x32"
                    alt="User Avatar"
                    className="w-8 h-8 rounded block object-cover align-middle"
                />
            </button>
            <ProfileItem isOpen={isOpen} items={menuItems} />
        </li>
    );
};

export default Profile;
