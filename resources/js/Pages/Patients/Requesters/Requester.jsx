import React, { useState, lazy, Suspense } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
import { HiOutlinePlusSm } from "react-icons/hi";
import Table from "@/Components/Table";

const MedicineRequesterModal = lazy(() => import("@/Components/Forms/MedicineRequesterModal"));

const Requester = ({ medicineRequesters, medicines }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicineRequester, setFilteredMedicineRequester] = useState(medicineRequesters);
  const [showModal, setShowModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const medicineRequesterColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "medicine_name", label: "Medicine" },
    { key: "quantity", label: "Quantity" },
    { key: "reason", label: "Reason" },
    { key: "created_at", label: "Created At", render: (date) => formatDate(date) },
  ];

  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    const filtered = medicineRequesters.filter((medicineRequester) =>
      (medicineRequester.patient_name || "").toLowerCase().includes(query.toLowerCase()) ||
      (medicineRequester.doctor_name || "").toLowerCase().includes(query.toLowerCase())
    );

    setFilteredMedicineRequester(filtered);
  };

  const toggleModal = (referral = null) => {
    setSelectedReferral(referral);
    setShowModal((prev) => !prev);
  };

  return (
    <PatientLayout>
      <Suspense fallback={<div>Loading...</div>}>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">Manage Medicine Requester</h2>
          <button
            type="button"
            className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
            onClick={() => toggleModal()} // Open the modal to create a new request
          >
            <HiOutlinePlusSm className="mr-1" /> Request Medicine
          </button>
        </div>

        <div className="pb-4 bg-white">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
              value={searchQuery}
              onChange={handleSearch}
              className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
        </div>

        <Table
          columns={medicineRequesterColumn}
          data={filteredMedicineRequester}
          noDataMessage="No Medicine Request Available."
        />
      </div>

      {/* Modal */}
      
        {showModal && (
          <MedicineRequesterModal
            showModal={showModal}
            toggleModal={toggleModal}
            selectedReferral={selectedReferral}
            medicines={medicines}
          />
        )}
       </Suspense>
    </PatientLayout>
  
  );
};

export default Requester;
