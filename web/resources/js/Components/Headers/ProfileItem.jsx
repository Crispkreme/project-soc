import React from 'react';
import { Link } from '@inertiajs/inertia-react';

const ProfileItem = ({ isOpen, items, className }) => {
    if (!isOpen) return null;

    return (
        <ul className={`dropdown-menu shadow-md shadow-black/5 z-30 py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px] absolute ${className}`}>
            {items.map((item, index) => (
                <li key={index}>
                    <Link
                        href={item.link}
                        className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default ProfileItem;
