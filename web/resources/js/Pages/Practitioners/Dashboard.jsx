import PatientLayout from '../../Layouts/PatientLayout';
import { Bar } from 'react-chartjs-2';
import React, { Suspense, useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatusButton = React.lazy(() => import("@/Components/Buttons/StatusButton"));
const ApproveModal = React.lazy(() => import("@/Components/Forms/ApproveModal"));
const PatientDetailsModal = React.lazy(() => import("@/Components/Modals/PatientDetailsModal"));
const CancelAppointmentModal = React.lazy(() => import("@/Components/Forms/CancelAppointmentModal"));
const Table = React.lazy(() => import("@/Components/Table"));

export default function Dashboard({ appointments, message, dataAnalytic }) {

    const [filteredAppointments, setFilteredAppointments] = useState(appointments);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [barangayEvents, setBarangayEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);

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
    const handlePatientClick = (appointment) => {

        setSelectedPatient(appointment);
        setShowPatientModal(true);
    
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`/get/patient/data/${appointment.patient_id}`);
                console.log('Fetched patient data:', response.data);
                setSelectedPatient({ ...appointment, patient_details: response.data.patient });
            } catch (error) {
                console.error("Error fetching patient data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchPatientData();
    };      
    const closePatientModal = () => {
        setShowPatientModal(false);
        setSelectedPatient(null);
    };

    const tableData = filteredAppointments
        .filter((appointment) => appointment.booking_status !== "Approve")
        .map((appointment) => ({
            patient_name: (
                <span
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() => handlePatientClick(appointment)}
                >
                    {appointment.patient_name}
                </span>
            ),
            title: appointment.title,
            appointment_date: appointment.appointment_date,
            appointment_time: `${appointment.appointment_start} - ${appointment.appointment_end}`,
            reason: appointment.reason,
            updated_at: appointment.updated_at,
            actions: [
                <StatusButton
                    key="Pending"
                    status={appointment.booking_status}
                    onClick={() => toggleModal(appointment, "Pending")}
                />,
                appointment.booking_status === "Pending" && (
                    <StatusButton
                        key="Cancel"
                        status="Failed"
                        onClick={() => toggleModal(appointment, "Cancel")}
                    />
                ),
            ].filter(Boolean),
        }));

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

    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const processDataAnalytics = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No valid data provided.");
            return {
                illnesses: {
                    labels: ["No data available"],
                    data: [0],
                },
                medicines: {
                    labels: ["No data available"],
                    data: [0],
                },
            };
        }
    
        const illnessesCount = {};
        const medicinesCount = {};
    
        data.forEach((record) => {
            illnessesCount[record.illness] = (illnessesCount[record.illness] || 0) + 1;
            medicinesCount[record.medicine] = (medicinesCount[record.medicine] || 0) + record.total_quantity;
        });
    
        const sortedIllnesses = Object.entries(illnessesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    
        const sortedMedicines = Object.entries(medicinesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    
        return {
            illnesses: {
                labels: sortedIllnesses.map((item) => item[0]),
                data: sortedIllnesses.map((item) => item[1]),
            },
            medicines: {
                labels: sortedMedicines.map((item) => item[0]),
                data: sortedMedicines.map((item) => item[1]),
            },
        };
    };    

    const { illnesses, medicines } = processDataAnalytics(dataAnalytic["December 2024"]);

    const illnessDataForChart = {
        labels: illnesses.labels,
        datasets: [
            {
                label: "Top Illnesses",
                backgroundColor: illnesses.labels.map(() => getRandomColor()),
                borderColor: "rgb(255, 99, 132)",
                data: illnesses.data,
            },
        ],
    };

    const medicineDataForChart = {
        labels: medicines.labels,
        datasets: [
            {
                label: "Top Medicines",
                backgroundColor: medicines.labels.map(() => getRandomColor()),
                borderColor: "rgb(255, 99, 132)",
                data: medicines.data,
            },
        ],
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

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Suspense>
            <PatientLayout>
                <Head title="Dashboard" />

                <div className="w-full md:w-[50%] mt-6 container mx-auto bg-white rounded-lg border border-gray-200 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                    {!barangayEvents ? (
                        <p>No upcoming events found.</p>
                    ) : (
                        <>
                            <h5 className="text-lg font-semibold text-gray-800">{barangayEvents.event_name}</h5>
                            <p className="text-gray-600">Dr. {barangayEvents.doctor_name} MD</p>
                            <p className="text-gray-600">
                                {barangayEvents.event_date} {barangayEvents.event_start} - {barangayEvents.event_end}
                            </p>
                        </>
                    )}
                </div>

                <div className="container mx-auto flex flex-col md:flex-row justify-around items-start mt-6 space-y-4 md:space-y-0 md:space-x-4">
                    <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
                        <Bar data={illnessDataForChart} />
                    </div>
                    <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
                        <Bar data={medicineDataForChart} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6 mt-4">
                    <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
                        <div className="flex justify-between mb-4 items-start">
                            <div className="font-medium">Manage Appointments</div>
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
                                data={tableData}
                                noDataMessage="No Appointments Available."
                            />
                        </div>
                    </div>
                </div>
                
                {showPatientModal && selectedPatient && (
                    <PatientDetailsModal
                        showModal={showPatientModal}
                        toggleModal={closePatientModal}
                        patient={selectedPatient}
                    />
                )}

                {showModal && modalType === "Pending" && selectedAppointment && (
                    <ApproveModal
                        showModal={showModal}
                        toggleModal={closeModal}
                        selectedAppointment={selectedAppointment}
                    />
                )}
                {showModal && modalType === "Cancel" && selectedAppointment && (
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
