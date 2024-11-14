import React from 'react';
import { usePage } from '@inertiajs/react';

const Sidebar = React.lazy(() => import("../Components/Sidebars/Sidebar"));
const Header = React.lazy(() => import("../Components/Headers/Header"));

const AdminLayout = ({ children }) => {

    const user = usePage().props.auth.user;
    const {someth} = usePage().props;

    console.log(someth.id);

    return (
        <>
            <Sidebar />

            <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-50 min-h-screen transition-all main">
            
                <Header userId={user.id} />

                <div className="p-6">
                    {children}
                </div>
                
            </main>
        </>
    )
}

export default AdminLayout
