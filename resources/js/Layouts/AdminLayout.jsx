import React from 'react';
const Sidebar = React.lazy(() => import("../Components/Sidebars/Sidebar"));
const Header = React.lazy(() => import("../Components/Headers/Header"));

const AdminLayout = ({ children }) => {
    return (
        <>
            <Sidebar />

            <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main">
            
                <Header />

                <div className="p-6">
                    {children}
                </div>
                
            </main>
        </>
    )
}

export default AdminLayout
