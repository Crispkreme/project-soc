import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import ProfileItem from './ProfileItem'; // Ensure you're importing the ProfileItem correctly
import axios from "axios";

const logoImage = "/assets/svg/logo.svg";
const headerImage = "/assets/svg/header.svg";

const Profile = ({ username, userId }) => {
    const user = usePage().props.auth.user;

    const [avatar, setAvatar] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await axios.get(`/user/avatar/${username}`);
                setAvatar(response.data.avatar);
            } catch (error) {
                console.error("Error fetching avatar:", error);
            }
        };

        if (username) fetchAvatar();
    }, [username]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(route("profile.details", userId));
                const data = await response.json();
                setUserDetail(data.userDetail);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) fetchUserDetails();
    }, [userId]);

    let menuItems = [];
    switch (user.role) {
        case "Administration":
            menuItems = [
                { label: "Profile", link: route("admin.view.profile", userId) },
                { label: "Settings", link: route("admin.view.profile", userId) },
                { label: "Logout", link: route("admin.logout") },
            ];
            break;
        case "Patient":
            menuItems = [
                { label: "Profile", link: route("patient.view.profile", userId) },
                { label: "Settings", link: route("patient.view.profile", userId) },
                { label: "Logout", link: route("patient.logout") },
            ];
            break;
        case "Practitioner":
            menuItems = [
                { label: "Profile", link: route("practitioner.view.profile", userId) },
                { label: "Settings", link: route("practitioner.view.profile", userId) },
                { label: "Logout", link: route("practitioner.logout") },
            ];
            break;
        default:
            menuItems = [
                { label: "Logout", link: route("logout") },
            ];
    }

    const renderAvatar = () => (
        avatar ? (
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
        )
    );

    const renderUserInfo = () => (
        <div className="font-medium dark:text-white">
            <div className="text-black text-left">
                {isLoading
                    ? "Loading..."
                    : `${userDetail?.firstname || ""} ${userDetail?.lastname || ""}`.trim()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-left">
                {userDetail?.role || ""}
            </div>
        </div>
    );

    return user.role === "Administration" ? (
        <li className="dropdown ml-3 relative">
            <button
                type="button"
                className="dropdown-toggle flex items-center"
                onClick={toggleDropdown}
            >
                {renderAvatar()}
                {renderUserInfo()}
            </button>
            <ProfileItem isOpen={isOpen} items={menuItems} />
        </li>
    ) : (
        <div className="flex justify-between items-center">
            <Link href={route('patient.dashboard')}>
                <img src={logoImage} alt="Logo" className="w-20 lg:w-32" />
            </Link>
            <div className="hidden lg:block z-50 search-bar flex items-center space-x-2">
                <input
                    type="text"
                    className="form-control text-black px-4 py-2 lg:w-[300px] rounded-lg border border-gray-300"
                    placeholder="Search"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
            </div>
            <div className="relative ms-3">
                <button onClick={toggleDropdown}>
                    <div className="flex items-center gap-4">
                        {renderAvatar()}
                        {renderUserInfo()}
                    </div>
                </button>
                <ProfileItem isOpen={isOpen} items={menuItems} />
            </div>
        </div>
    );
};

export default Profile;
