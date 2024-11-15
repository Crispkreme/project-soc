import StandardLayout from '@/Layouts/StandardLayout';
import { Head } from '@inertiajs/react';
import PatientLayout from '@/Layouts/PatientLayout';
import Chart from "chart.js/auto";
import { Bar } from 'react-chartjs-2';

export default function Dashboard() {

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const commonIlness = [
    {name: "Cough", percent: 46},
    {name: "Flu", percent: 23},
    {name: "Fever", percent: 38},
  ]

  const medecine = [
    {name: "Biogesic", sold: 53},
    {name: "BioFlu", sold: 23},
  ]

  const data = {
    labels: ["Common Ilness"],
    datasets: commonIlness.map( c => {
      return {
        label: c.name,
        backgroundColor: getRandomColor(),
        borderColor: "rgb(255, 99, 132)",
        data: [c.percent],
      }
    }),
  };

  const medecineData = {
    labels: ["In-Demand Medecine"],
    datasets: medecine.map( c => {
      return {
        label: c.name,
        backgroundColor: getRandomColor(),
        borderColor: "rgb(255, 99, 132)",
        data: [c.sold],
      }
    }),
  };
    

  
    return (
        <PatientLayout>
            <Head title="Dashboard" />
            <div className="w-full md:w-[50%] mt-6 container mx-auto bg-white rounded-lg border border-gray-200 p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300">
                <h5 className="text-lg font-semibold text-gray-800">Dental and General Check Up</h5>
                <p className="text-gray-600">Dr. Sam Gonzales MD</p>
                <p className="text-gray-600">April 29, 2024 Mon 8AM - 3PM</p>
            </div>


            <div className="container mx-auto flex flex-col md:flex-row justify-around items-start mt-6 space-y-4 md:space-y-0 md:space-x-4">
                <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
                  <Bar data={data}/>
                </div>
                <div className="chart-card bg-gray-50 rounded-lg p-6 text-center shadow-lg w-full md:w-1/2">
                  <Bar data={medecineData}/>
                </div>
            </div>
        </PatientLayout>
    );
}
