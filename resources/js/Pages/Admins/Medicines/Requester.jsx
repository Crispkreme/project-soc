import React, { useState, lazy, Suspense } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Table from "@/Components/Table";
import { Head } from "@inertiajs/react";

const ApproveMedicineRequesterModal = lazy(() => import("@/Components/Forms/ApproveMedicineRequesterModal"));
const StatusButton = lazy(() => import("@/Components/Buttons/StatusButton"));

const Requester = ({ medicineRequesters, medicines }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicineRequester, setFilteredMedicineRequester] = useState(medicineRequesters);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicineRequester, setSelectedMedicineRequester] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const toggleMedicineRequesterModal = (requester = null) => {
    setSelectedMedicineRequester(requester);
    setShowModal((prev) => !prev);
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    const filtered = medicineRequesters.filter((requester) =>
      (requester.medicine_name || "").toLowerCase().includes(query) ||
      (requester.reason || "").toLowerCase().includes(query)
    );

    setFilteredMedicineRequester(filtered);
  };

  const medicineRequesterColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "medicine_name", label: "Medicine" },
    { key: "quantity", label: "Quantity" },
    { key: "reason", label: "Reason" },
    { key: "created_at", label: "Created At", render: (date) => formatDate(date) },
    { 
      key: "action", 
      label: "Action", 
      render: (row) => (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            console.log("Row data:", row);
            toggleMedicineRequesterModal(row);
          }}
        >
          Approve
        </button>
      )
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout>
        <Head title="Manage Medicines" />
        <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                id="table-search"
                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for medicine requests"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={medicineRequesterColumn}
              data={filteredMedicineRequester}
              noDataMessage="No Medicine Request Available."
            />
          </div>
        </div>

        {showModal && (
          <ApproveMedicineRequesterModal
            showModal={showModal}
            toggleModal={toggleMedicineRequesterModal}
            selectedMedicineRequester={selectedMedicineRequester}
            medicines={medicines}
          />
        )}
      </AdminLayout>
    </Suspense>
  );
};

export default Requester;
