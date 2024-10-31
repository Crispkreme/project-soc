import React from 'react'

const Breadcrumb = () => {
    return (
        <ul className="flex items-center text-sm ml-4">
            <li className="mr-2">
                <a href="#" className="text-gray-400 hover:text-gray-600 font-medium">Dashboard</a>
            </li>
            <li className="text-gray-600 mr-2 font-medium">/</li>
            <li className="text-gray-600 mr-2 font-medium">Analytics</li>
        </ul>
    )
}

export default Breadcrumb