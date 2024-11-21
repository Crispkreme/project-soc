import React, { useState, Suspense } from "react";
import { Head } from "@inertiajs/react";
import { TbUserShield, TbUserExclamation } from "react-icons/tb";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const AccountModal = React.lazy(() => import("./AccountModal"));

const Patient = ({ userDetails }) => {
  const [showModal, setShowModal] = useState(false);

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      ageYears--;
    }
    return `${ageYears}`;
  };

  const toggleModal = (value = null) => {
    setShowModal(value === null ? !showModal : value);
  };

  return (
    <Suspense fallback={<div className="text-center py-4">Loading layout...</div>}>
      <AdminLayout>
        <Head title="Accounts" />
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Manage Patient Accounts</h2>
            </div>

            <div className="pb-4 bg-white">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for items"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="p-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Gender</th>
                    <th scope="col" className="px-6 py-3">Birthdate</th>
                    <th scope="col" className="px-6 py-3">Age</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.length > 0 ? (
                    userDetails.map((userDetail, index) => (
                      <tr
                        key={userDetail.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">
                          {userDetail.firstname} {userDetail.middlename}{" "}
                          {userDetail.lastname}
                        </td>
                        <td className="px-6 py-4">{userDetail.gender}</td>
                        <td className="px-6 py-4">
                          {new Date(userDetail.birthday).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {calculateAge(userDetail.birthday)}
                        </td>
                        <td className="px-6 py-4">{userDetail.role}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block p-1 rounded font-medium text-[12px] leading-none ${
                              userDetail.status === "active"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {userDetail.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className={`${
                              userDetail.status === "active"
                                ? "bg-red-50 text-red-400 hover:text-red-600"
                                : "bg-green-50 text-green-400 hover:text-green-600"
                            } text-xs font-medium py-1 px-2 flex items-center`}
                            onClick={() => toggleModal(true)}
                          >
                            {userDetail.status === "active" ? (
                              <TbUserExclamation className="mr-1 text-sm" />
                            ) : (
                              <TbUserShield className="mr-1 text-sm" />
                            )}
                            {userDetail.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-gray-500">
                        No Account Available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showModal && <AccountModal showModal={showModal} toggleModal={toggleModal} />}
      </AdminLayout>
    </Suspense>
  );
};

export default Patient;
