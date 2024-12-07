import React, { useState, Suspense } from "react";
import { Head, router } from "@inertiajs/react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { TbUserShield, TbUserExclamation } from "react-icons/tb";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const AccountModal = React.lazy(() => import("@/Components/Forms/AccountModal"));
const DialogBox = React.lazy(() => import("@/Components/Modals/DialogBox"));

const Patient = ({ accounts }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = (value = null) => {
    setShowModal(value === null ? !showModal : value);
  };

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const handleDeactivate = (status, userId) => {
    const action = status === "Active" ? "deactivate" : "activate";

    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to ${action} this account?`,
      onConfirm: () => {
        const route = `/accounts/${action}`;
        router.post(route, { id: userId }, {
          onSuccess: () => {
            setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
          },
          onError: (error) => {
            console.error("Error updating account status:", error);
            setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
          },
        });
      },
    });
  };

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

  return (
    <Suspense fallback={<div className="text-center py-4">Loading layout...</div>}>
      <AdminLayout>
        <Head title="Accounts" />
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Manage Patient Accounts</h2>
              <button
                type="button"
                className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                onClick={() => toggleModal(true)}
              >
                <HiOutlinePlusSm className="mr-1" /> Account
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
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
                  {accounts.length > 0 ? (
                    accounts.map((account, index) => (
                      <tr
                        key={account.id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          {account.name}
                        </td>
                        <td className="px-6 py-4">{account.gender}</td>
                        <td className="px-6 py-4">
                          {new Date(account.birthday).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {calculateAge(account.birthday)}
                        </td>
                        <td className="px-6 py-4">{account.role}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block p-1 rounded font-medium text-[12px] leading-none ${
                              account.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {account.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className={`${
                              account.status === "Active"
                                ? "bg-red-50 text-red-400 hover:text-red-600"
                                : "bg-green-50 text-green-400 hover:text-green-600"
                            } text-xs font-medium py-1 px-2 flex items-center`}
                            onClick={() => handleDeactivate(account.status, account.id)}
                          >
                            {account.status === "Active" ? (
                              <TbUserExclamation className="mr-1 text-sm" />
                            ) : (
                              <TbUserShield className="mr-1 text-sm" />
                            )}
                            {account.status === "Active" ? "Deactivate" : "Activate"}
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

        {showModal && <AccountModal showModal={showModal} toggleModal={toggleModal} isPage="Patient"/>}
      </AdminLayout>

      <DialogBox
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onClose={() => setConfirmDialog({ isOpen: false, message: "", onConfirm: null })}
        onConfirm={confirmDialog.onConfirm}
      />
    </Suspense>
  );
};

export default Patient;
