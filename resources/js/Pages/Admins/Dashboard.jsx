import AdminLayout from '../../Layouts/AdminLayout';
import { Bar } from 'react-chartjs-2';
import React, { Suspense, useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
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
    const [barangayEvents, setBarangayEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    
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
        { key: "approver_name", label: "Approvers Name" },
        { key: "title", label: "Appointment" },
        { key: "appointment_date", label: "Event Date" },
        { key: "appointment_time", label: "Time" },
        { key: "reason", label: "Reason" },
        { key: "updated_at", label: "Updated" },
        { key: "actions", label: "Action" },
    ];
    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);

    useEffect(() => {
        const fetchUpcomingBarangayEvents = async () => {
          try {
            const response = await axios.get("/get/upcoming/barangay/event");
            setBarangayEvents(response.data.barangayEvents);
          } catch (error) {
            console.error("Error fetching barangayEvents:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUpcomingBarangayEvents();
    }, []);
    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (!barangayEvents) {
        return <p>No upcoming events found.</p>;
    }

    const { event_name, event_date, event_start, event_end, doctor_name } = barangayEvents;
    
    return (
        <Suspense>
            <AdminLayout>
                <Head title="Dashboard" />
                <div className="w-full md:w-[50%] mt-6 container mx-auto bg-white rounded-lg border border-gray-200 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                    <h5 className="text-lg font-semibold text-gray-800">{event_name}</h5>
                    <p className="text-gray-600">Dr. {doctor_name} MD</p>
                    <p className="text-gray-600">
                        {event_date} {event_start} - {event_end}
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
                                    approver_name: appointment.doctor_name,
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
            </AdminLayout>
        </Suspense>
    );
}
