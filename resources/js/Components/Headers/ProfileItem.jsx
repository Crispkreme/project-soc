import React, { useState } from "react";

const ProfileItem = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

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
            {isOpen && (
                <ul className="dropdown-menu shadow-md shadow-black/5 z-30 py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px] absolute">
                    <li>
                        <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                            Profile
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                            Settings
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                            Logout
                        </a>
                    </li>
                </ul>
            )}
        </li>
    );
};

export default ProfileItem;
