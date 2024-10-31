import React from 'react'
import Sidebar from '../Components/Sidebars/Sidebar'
import Header from '../Components/Headers/Header'

const AdminLayout = ({ children }) => {
    return (
        <>
            <Sidebar />

            <main class="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main">
            
                <Header />

                <div class="p-6">
                    {children}
                </div>
                
            </main>
        </>
    )
}

export default AdminLayout
