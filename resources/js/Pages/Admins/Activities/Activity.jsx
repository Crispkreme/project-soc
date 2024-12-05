import React, { useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { HiOutlinePlusSm } from "react-icons/hi";
import { LuClipboardEdit } from "react-icons/lu";
import { toast } from 'react-hot-toast';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const BarangayEventModal = React.lazy(() => import("@/Components/Forms/BarangayEventModal"));
const ViewBarangayEventModal = React.lazy(() => import("@/Components/Forms/ViewBarangayEventModal"));
const Table = React.lazy(() => import("@/Components/Table"));

const Activity = ({ barangayEvents, doctors, bhws }) => {
    const [showBarangayEventModal, setShowBarangayEventModal] = useState(false);
    const [showViewBarangayEventModal, setShowViewBarangayEventModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBarangayEvents, setFilteredBarangayEvents] = useState(barangayEvents);
    const [selectedBarangayEvent, setSelectedBarangayEvent] = useState(null);
    const [selectedViewBarangayEvent, setSelectedViewBarangayEvent] = useState(null);
  
    const toggleBarangayEventModal = (barangayEvent = null, isEditing = false) => {
      setSelectedBarangayEvent(barangayEvent);
      setIsEditing(isEditing);
      setShowBarangayEventModal(!showBarangayEventModal);
    };
  
    const toggleViewBarangayEventModal = (barangayEvent = null) => {
      setSelectedViewBarangayEvent(barangayEvent);
      setIsViewing(true);
      setShowViewBarangayEventModal(!showViewBarangayEventModal);
    };
  
    const barangayEventColumn = [
      { key: "doctor_name", label: "Doctor Name" },
      { key: "bhw_name", label: "In Charge" },
      { key: "event_name", label: "Event" },
      { key: "event_venue", label: "Venue" },
      { key: "event_time", label: "Time" },
      { key: "event_date", label: "Date of Event" },
    ];
  
    const barangayEventAction = [
      {
        label: "View",
        icon: LuClipboardEdit,
        onClick: (row) => {
          toggleViewBarangayEventModal(row);
          toast.info("Viewing Barangay Event...");
        },
        style: "bg-yellow-300 text-yellow-800 hover:bg-yellow-400"
      },
      {
        label: "Edit",
        icon: LuClipboardEdit,
        onClick: (row) => {
          toggleBarangayEventModal(row, true);
          toast.info("Editing Barangay Event...");
        },
        style: "bg-blue-300 text-blue-800 hover:bg-blue-400"
      },
    ];
  
    const handleSearch = (e) => {
      const query = e.target.value;
      setSearchQuery(query);
  
      const filtered = barangayEvents.filter((event) => {
        const doctorName = event.doctor_name ? event.doctor_name.toLowerCase() : "";
        const bhwName = event.bhw_name ? event.bhw_name.toLowerCase() : "";
        return (
          event.event_name.toLowerCase().includes(query.toLowerCase()) ||
          doctorName.includes(query.toLowerCase()) ||
          bhwName.includes(query.toLowerCase()) 
        );
      });
  
      setFilteredBarangayEvents(filtered);
    };
  
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLayout>
          <Head title="Barangay Events" />
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Manage Barangay Events</h2>
                <button
                  type="button"
                  className="bg-green-50 text-sm font-medium text-green-400 py-2 px-4 hover:text-green-600 flex items-center"
                  onClick={() => toggleBarangayEventModal(null, false)}
                >
                  <HiOutlinePlusSm className="mr-1" /> Add Barangay Event
                </button>
              </div>
              <div className="pb-4">
                <div className="relative">
                  <input
                    type="text"
                    id="table-search"
                    className="block w-80 pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search for Barangay Event"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={barangayEventColumn}
                  data={filteredBarangayEvents}
                  actions={barangayEventAction}
                  renderActions={(action, row) => (
                    <button
                      key={action.label}
                      onClick={() => action.onClick(row)}
                      className={`inline-flex items-center px-4 py-2 mr-2 rounded-md text-sm font-medium ${action.style}`}
                    >
                      <action.icon className="mr-2" />
                      {action.label}
                    </button>
                  )}
                  noDataMessage="No Barangay Events Available."
                />
              </div>
            </div>
          </div>
        </AdminLayout>
  
        {showBarangayEventModal && <BarangayEventModal 
          showModal={showBarangayEventModal} 
          toggleBarangayEventModal={toggleBarangayEventModal} 
          doctors={doctors} 
          barangayEvents={barangayEvents}
          bhws={bhws}
          isEditing={isEditing}
          selectedBarangayEvent={selectedBarangayEvent}
        />}
  
        {showViewBarangayEventModal && <ViewBarangayEventModal 
          showModal={showViewBarangayEventModal} 
          toggleViewBarangayEventModal={toggleViewBarangayEventModal} 
          selectedBarangayEvent={selectedViewBarangayEvent}
        />}
      </Suspense>
    );
  };

export default Activity;
