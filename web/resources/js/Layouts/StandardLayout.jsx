import React from 'react';

const logo = "/assets/svg/logo.svg";
const header = "/assets/svg/header.svg";

const StandardLayout = ({children}) => {
  return (
    <>
        <div className="header bg-cover p-5 text-white text-center" style={{ backgroundImage: `url(${header})`, height: '109px' }}>
            <div className="flex justify-between items-center">
                <img src={logo} alt="Logo" className="w-24" />
                <div className="search-bar flex items-center space-x-2">
                    <input
                    type="text"
                    className="form-control px-4 py-2 rounded-lg border border-gray-300"
                    placeholder="Search"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
                </div>
                <img src="profile-icon.png" alt="Profile" className="w-12 h-12 rounded-full bg-gray-200" />
            </div>
        </div>

        <main className='p-6'>
            {children}
        </main>
    </>
  );
};

export default StandardLayout;
