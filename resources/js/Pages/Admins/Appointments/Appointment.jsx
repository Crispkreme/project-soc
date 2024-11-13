import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));

const Appointment = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <AdminLayout>
            
            <Head title="Appointments" />
            
            <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="flex justify-between mb-4 items-start">
                        <div className="font-medium">Manage Appointment</div>
                    </div>
                    <div className="flex items-center mb-4 order-tab justify-between">
                        <button 
                            type="button" 
                            className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                            onClick={() => { toggleModal(); }}
                        >
                            <HiOutlinePlusSm className="mr-1" /> Account
                        </button>

                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                            <thead>
                                <tr>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Name</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Gender</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Birthdate</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Age</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Role</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* {userDetails.length > 0 ? userDetails.map((userDetail) => (
                                <tr key={`${userDetail.id}-${userDetail.firstname}`}>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <div className="flex items-center">
                                            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                                            <a 
                                                href="#" 
                                                className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                                            >
                                                {userDetail.firstname} {userDetail.middlename} {userDetail.lastname}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{userDetail.gender}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{userDetail.birthday}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{calculateAge(userDetail.birthday)}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{userDetail.role}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">{userDetail.status}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        {userDetail.status ? (
                                            <button 
                                                type="button" 
                                                className="bg-red-50 text-sm font-medium text-red-400 py-2 px-4 hover:text-red-600 flex items-center"
                                                onClick={() => { toggleModal(); }}
                                            >
                                                <TbUserExclamation className="mr-1" /> Deactive
                                            </button>
                                        ) : (
                                            <button 
                                                type="button" 
                                                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                                                onClick={() => { toggleModal(); }}
                                            >
                                                <TbUserShield className="mr-1" /> Active
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-gray-500">{t('No Account Available')}.</td>
                                </tr>
                            )}       */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </AdminLayout>
    </Suspense>
  )
}

export default Appointment
