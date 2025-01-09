import { useState, lazy, Suspense } from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
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
    { key: "medicine_name", label: "Medicine" },
    { key: "quantity", label: "Quantity" },
    { key: "reason", label: "Reason" },
    { key: "medication_status", label: "Status" },
    { key: "created_at", label: "Requested Date", render: (date) => formatDate(date) },
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
    setSelectedReferral(referral); // Set the selected referral (if any)
    setShowModal(true); // Set showModal to true to display the modal
  };

  return (
    <PatientLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">Manage Medicine Requester</h2>
            {/* <button
              type="button"
              className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
              onClick={() => toggleModal()} // Open modal with no referral by default
            >
              <HiOutlinePlusSm className="mr-1" /> Request Medicine
            </button> */}
          </div>
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                id="table-search"
                className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for inventory"
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