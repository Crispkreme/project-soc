import React, { useState, useEffect } from "react";
import { Link, usePage } from '@inertiajs/react';
import ProfileItem from './ProfileItem';
import { IoSearch } from "react-icons/io5";
import axios from "axios";

const logoImage = "/assets/svg/logo.svg";
const headerImage = "/assets/svg/header.svg";

const Profile = ({ username, userId }) => {
    const user = usePage().props.auth.user;

    const [avatar, setAvatar] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

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

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length >= 3) {
            setIsSearching(true);
            try {
                const response = await axios.get(`/medicines/search`, { params: { query } });
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error fetching medicines:", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };
    
    let menuItems = [];
    switch (user.role) {
        case "Administration":
            menuItems = [
                { label: "Settings", link: route("admin.view.profile", userId) },
                { label: "Logout", link: route("admin.logout") },
            ];
            break;
        case "Bhw":
            menuItems = [
                { label: "Settings", link: route("bhw.view.profile", userId) },
                { label: "Logout", link: route("bhw.logout") },
            ];
            break;
        case "Patient":
            menuItems = [
                { label: "Settings", link: route("patient.view.profile", userId) },
                { label: "Logout", link: route("patient.logout") },
            ];
            break;
        case "Practitioner":
            menuItems = [
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

    return user.role === "Administration" || user.role === "Bhw" ? (
        <li className="dropdown ml-3 relative">
            <div className="relative ms-3">
                <button onClick={toggleDropdown}>
                    <div className="flex items-center gap-4">
                        {renderAvatar()}
                        {renderUserInfo()}
                    </div>
                </button>
                <ProfileItem isOpen={isOpen} items={menuItems} />
            </div>
        </li>
    ) : (
        <div className="flex justify-between items-center">
            <Link href={route('patient.dashboard')}>
                <img src={logoImage} alt="Logo" className="w-20 lg:w-32" />
            </Link>

            <div className="hidden lg:block z-50 search-bar flex items-center space-x-2">
                <div className="relative w-full lg:w-[300px]">
                    <input
                        type="text"
                        className="form-control text-black px-4 py-2 rounded-lg border w-[500px] border-gray-300 pl-10"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <IoSearch />
                    </span>
                </div>
                {isSearching && (
                    <div className="absolute bg-white border border-gray-300 w-[500px] z-10 mt-1">
                        <div className="text-center py-2">Loading...</div>
                    </div>
                )}
                {searchResults.length > 0 && !isSearching && (
                    <div className="absolute bg-white border border-gray-300 w-[500px] z-10 mt-1">
                        <ul>
                            {searchResults.map((medicine, index) => (
                                
                                <li key={index} className="py-2 px-4 text-sm cursor-pointer hover:bg-gray-100 text-black">
                                    {medicine}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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