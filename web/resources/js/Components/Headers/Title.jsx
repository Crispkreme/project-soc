import React from 'react'

const Title = ({ children }) => {
    return (
        <h2 className='sm:text-xl font-bold text-gray-700 text-1xl dark:text-gray-400 inline-flex items-center justify-end w-full'>
            { children }
        </h2>
    )
}

export default Title