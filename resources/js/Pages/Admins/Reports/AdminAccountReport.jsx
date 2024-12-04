import React, { useState, Suspense } from "react";
import { Head } from "@inertiajs/react";

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Table = React.lazy(() => import("@/Components/Table"));

const AdminAccountReport = ({ accounts }) => {
  console.log("accounts", accounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = accounts.filter(({ firstname, middlename, lastname, gender, role, status }) =>
      `${firstname} ${middlename} ${lastname}`.toLowerCase().includes(query) ||
      gender.toLowerCase().includes(query) ||
      role.toLowerCase().includes(query) ||
      status.toLowerCase().includes(query)
    );

    setFilteredAccounts(filtered);
  };

  const accountColumns = [
    { key: "name", label: "Name" },
    { key: "gender", label: "Gender" },
    { key: "birthday", label: "Birthdate" },
    { key: "age", label: "Age" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status", render: (value) => (
        <span className={`inline-block p-1 rounded font-medium text-[12px] leading-none ${
          value === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <Suspense fallback={<div className="text-center py-4">Loading layout...</div>}>
      <AdminLayout>
        <Head title="Accounts" />
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Manage Administration Accounts Report</h2>
            </div>

            <div className="pb-4">
              <div className="relative">
                <input
                  type="text"
                  id="table-search"
                  className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for accounts"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <svg
                  className="absolute left-3 top-3 w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 104.938 14.598l5.664 5.663a1 1 0 001.415-1.414l-5.663-5.664A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table
                columns={accountColumns}
                data={filteredAccounts}
                noDataMessage="No Account Available."
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    </Suspense>
  );
};

export default AdminAccountReport;
