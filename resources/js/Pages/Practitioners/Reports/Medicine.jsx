import React, { useState } from "react";
import PatientLayout from "@/Layouts/PatientLayout";
import Table from "@/Components/Table";

const Medicine = ({ inventories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInventories, setFilteredInventories] = useState(inventories);

  const InventoryColumn = [
    { key: "id", label: "ID", render: (_, __, index) => index + 1 },
    { key: "medicine_name", label: "Medicine Name" },
    { key: "description", label: "Description" },
    { key: "sold", label: "Dispense" },
    { key: "in_stock", label: "In-Stock" },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = inventories.filter(
      (inventory) =>
        inventory.medicine_name.toLowerCase().includes(query.toLowerCase()) ||
        inventory.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredInventories(filtered);
  };

  return (
    <PatientLayout>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium">List of Medicine</h2>
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
              columns={InventoryColumn}
              data={filteredInventories}
              noDataMessage="No medicines available."
            />
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Medicine;
