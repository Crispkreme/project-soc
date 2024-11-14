import React, { useState, useEffect } from "react";
import axios from 'axios';

const ProfileItem = React.lazy(() => import("./ProfileItem"));

const Profile = ({ username, userId }) => {
    const [avatar, setAvatar] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        async function fetchAvatar() {
            try {
                const response = await axios.get(`/user/avatar/${username}`);
                setAvatar(response.data.avatar);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        }
        fetchAvatar();
    }, [username]);

    const menuItems = [
        { label: 'Profile', link: route('admin.view.profile', userId) },
        { label: 'Settings', link: route('admin.view.profile', userId) },
        { label: 'Logout', link: route('logout') },
    ];

    return (
        <li className="dropdown ml-3 relative">
            <button
                type="button"
                className="dropdown-toggle flex items-center"
                onClick={toggleDropdown}
            >
                {avatar ? (
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded block object-cover align-middle"
                    />
                ) : (
                    <img
                        src="https://placehold.co/32x32"
                        alt="Default Avatar"
                        className="w-8 h-8 rounded block object-cover align-middle"
                    />
                )}
            </button>
            <ProfileItem isOpen={isOpen} items={menuItems} />
        </li>
    );
};

export default Profile;
