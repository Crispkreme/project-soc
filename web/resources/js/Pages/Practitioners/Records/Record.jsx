import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));

const Record = ({ userDetails }) => {

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);

    let ageYears = today.getFullYear() - birthDate.getFullYear();

    return `${ageYears}`;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout>

        <Head title="Medical" />

        <div className='grid grid-cols-1 gap-6 mb-6'>
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <div className="flex justify-between mb-4 items-start">
              <div className="font-medium">Manage Accounts</div>
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
                    </tr>
                  </thead>
                  <tbody>
                  {userDetails.length > 0 ? userDetails.map((userDetail) => (
                    <tr key={`${userDetail.id}-${userDetail.firstname}`}>
                      <td className="py-2 px-4 border-b border-b-gray-50">
                        <div className="flex items-center">
                          <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                          <a 
                            href={route('admin.medical.patient.record', { id: userDetail.id })} 
                            className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate"
                          >
                            {userDetail.name}
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
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-gray-500">{t('No Account Available')}.</td>
                    </tr>
                  )}      
                  </tbody>
                </table>
            </div>
          </div>
        </div>

      </AdminLayout>
    </Suspense>
  )
}

export default Record
