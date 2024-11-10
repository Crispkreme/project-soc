import StandardLayout from '@/Layouts/StandardLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <StandardLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto text-center my-6 space-x-2 flex justify-center mt-[-40px]">
                <button className="border bg-white border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition">
                    Book Appointments
                </button>
                <button className="border bg-white border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition">
                    Community
                </button>
                <button className="border bg-white border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition">
                    Service Available
                </button>
                <button className="border bg-white border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition">
                    My Records
                </button>
            </div>

            <div className="w-[50%] mt-6 container mx-auto bg-white rounded-lg border border-gray-200 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                <h5 className="text-lg font-semibold text-gray-800">Dental and General Check Up</h5>
                <p className="text-gray-600">Dr. Sam Gonzales MD</p>
                <p className="text-gray-600">April 29, 2024 Mon 8AM - 3PM</p>
            </div>


            <div className="container mx-auto flex flex-col md:flex-row justify-around items-start mt-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
                    <h6 className="text-lg font-semibold">Common Illness</h6>
                    <p className="text-gray-600">Cough - 46%<br />Flu - 38%</p>
                </div>
                <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
                    <h6 className="text-lg font-semibold">In-Demand Medicine</h6>
                    <p className="text-gray-600">Biogesic<br />Bioflu</p>
                </div>
            </div>
        </StandardLayout>
    );
}
