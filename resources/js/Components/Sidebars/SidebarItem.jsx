import React, { useState } from "react";
import { Link } from '@inertiajs/inertia-react';
import { useSelector } from "react-redux";

const SidebarItem = ({ icon: Icon, label, link, dropdownItems = [] }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const open = useSelector(state => state.sidebar.open);

    return (
        <li className="mb-1 group">
            {dropdownItems.length > 0 ? (
                <>
                    <button
                        onClick={handleToggle}
                        className="flex items-center w-full py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md focus:outline-none"
                    >
                        <Icon className="mr-2" />
                        <span className="text-lg">{label}</span>
                        <i
                            className={`ri-arrow-right-s-line ml-auto transform ${
                                isOpen ? "rotate-90" : ""
                            }`}
                        ></i>
                    </button>
                    {isOpen && (
                        <div className="pl-7 mt-2">
                            {dropdownItems.map((item, index) => (
                                <Link
                                    href={item.link}
                                    key={index}
                                    className="text-gray-300 text-lg flex items-center hover:text-gray-100 mb-4"
                                >
                                    <span className="before:contents-[''] before:w-1 before:h-1 before:rounded-full before:bg-gray-300 before:mr-3"></span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={link}
                    className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md"
                >
                    <Icon className="mr-2" />
                    <span className="text-lg">{label}</span>
                </Link>
            )}
        </li>
    );
};

export default SidebarItem;
