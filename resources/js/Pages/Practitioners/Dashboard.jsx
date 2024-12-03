import PatientLayout from "@/Layouts/PatientLayout";
import { Bar } from 'react-chartjs-2';
import React, { Suspense, useState } from "react";
import { Head } from "@inertiajs/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatusButton = React.lazy(() =>import("@/Components/Buttons/StatusButton"));
const ApproveModal = React.lazy(() =>import("@/Components/Forms/ApproveModal"));
const CancelAppointmentModal = React.lazy(() =>import("@/Components/Forms/CancelAppointmentModal"));
const Table = React.lazy(() => import("@/Components/Table"));

export default function Dashboard({ appointments, message }) {
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const toggleModal = (appointment = null, type = "") => {
      setSelectedAppointment(appointment);
      setModalType(type);
      setShowModal(!showModal);
    };
    const closeModal = () => {
      setShowModal(false);
      setModalType("");
      setSelectedAppointment(null);
    };
    const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = appointments.filter((appointment) => {
        const patientName = appointment.patient_name?.toLowerCase() || "";
        return (
          appointment.title.toLowerCase().includes(query) ||
          patientName.includes(query)
        );
      });

      setFilteredAppointments(filtered);
    };
    function getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    const commonIlness = [
      { name: "Cough", percent: 46 },
      { name: "Flu", percent: 23 },
      { name: "Fever", percent: 38 },
    ];
    const medecine = [
      { name: "Biogesic", sold: 53 },
      { name: "BioFlu", sold: 23 },
    ];
    const data = {
      labels: ["Common Ilness"],
      datasets: commonIlness.map((c) => {
        return {
          label: c.name,
          backgroundColor: getRandomColor(),
          borderColor: "rgb(255, 99, 132)",
          data: [c.percent],
        };
      }),
    };
    const medecineData = {
      labels: ["In-Demand Medecine"],
      datasets: medecine.map((c) => {
        return {
          label: c.name,
          backgroundColor: getRandomColor(),
          borderColor: "rgb(255, 99, 132)",
          data: [c.sold],
        };
      }),
    };
    const appointmentColumns = [
      { key: "patient_name", label: "Patient Name" },
      { key: "title", label: "Appointment" },
      { key: "appointment_date", label: "Event Date" },
      { key: "appointment_time", label: "Time" },
      { key: "reason", label: "Reason" },
      { key: "updated_at", label: "Updated" },
      { key: "actions", label: "Action" },
    ];

    return (
      <Suspense>
        <PatientLayout>
          <Head title="Dashboard" />
          <div className="w-full md:w-[50%] mt-6 container mx-auto bg-white rounded-lg border border-gray-200 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
            <h5 className="text-lg font-semibold text-gray-800">
              Dental and General Check-Up
            </h5>
            <p className="text-gray-600">Dr. Sam Gonzales MD</p>
            <p className="text-gray-600">
              April 29, 2024 Mon 8AM - 3PM
            </p>
          </div>

          <div className="container mx-auto flex flex-col md:flex-row justify-around items-start mt-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
              <Bar data={data} />
            </div>
            <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
              <Bar data={medecineData} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 mt-4">
            <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
              <div className="flex justify-between mb-4 items-start">
                <div className="font-medium">
                  Manage Appointments
                </div>
                <input
                  type="text"
                  placeholder="Search appointments"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="border p-2 rounded text-sm w-64"
                />
              </div>
              <div className="overflow-x-auto">
                <Table
                  columns={appointmentColumns}
                  data={filteredAppointments
                    .filter(appointment => appointment.booking_status !== "Approve")
                    .map(appointment => ({
                      patient_name: appointment.patient_name,
                      title: appointment.title,
                      appointment_date: appointment.appointment_date,
                      appointment_time: `${appointment.appointment_start} - ${appointment.appointment_end}`,
                      reason: appointment.reason,
                      updated_at: appointment.updated_at,
                      actions: [
                        <StatusButton
                          key="approve"
                          status={appointment.booking_status}
                          onClick={() => toggleModal(appointment, "approve")}
                        />,
                        appointment.booking_status === 'Pending' && (
                          <StatusButton
                            key="cancel"
                            status="Failed"
                            onClick={() => toggleModal(appointment, "cancel")}
                          />
                        )
                      ].filter(Boolean),
                    }))}
                  noDataMessage="No Appointments Available."
                />
              </div>
            </div>
          </div>

          {showModal && modalType === "approve" && selectedAppointment && (
            <ApproveModal
              showModal={showModal}
              toggleModal={closeModal}
              selectedAppointment={selectedAppointment}
            />
          )}

          {showModal && modalType === "cancel" && selectedAppointment && (
            <CancelAppointmentModal
              showModal={showModal}
              toggleModal={closeModal}
              selectedAppointment={selectedAppointment}
            />
          )}
        </PatientLayout>
      </Suspense>
    );
}
