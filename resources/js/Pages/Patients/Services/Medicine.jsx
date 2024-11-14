import React from 'react';
import PatientLayout from '@/Layouts/PatientLayout';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Medicine = ({ inventories }) => {
  console.log(inventories);
  const medicines = [
    { 
      id: 1, 
      medicine: "Paracetamol Biogesic",
      description: "If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.",
      dosage: "500mg", 
      available: { 
        packs: 2, 
        pieces: 200 
      },
    },
  ];

  return (
    <PatientLayout>
      <div className="p-8">
        <div className="border border-black rounded-xl">
          <table className=" min-w-full rounded-xl">
            <thead className="bg-secondary-bg">
              <tr className="border-b border-black">
                <th className="p-5 text-center text-md font-semibold text-gray-900 capitalize">ID</th>
                <th className="p-5 text-left text-md font-semibold text-gray-900 capitalize">Medicine</th>
                <th className="p-5 text-left text-md font-semibold text-gray-900 capitalize">Description</th>
                <th className="p-5 text-left text-md font-semibold text-gray-900 capitalize">Dosage</th>
                <th className="p-5 text-left text-md font-semibold text-gray-900 capitalize">Available</th>
                <th className="p-5 text-left text-md font-semibold text-gray-900 capitalize">Sold</th>
                <th className="p-5 text-left text-md font-semibold text-gray-900 capitalize">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {inventories.map((item, index) => (
                <tr key={item.id} className="bg-white transition-all duration-500 hover:bg-gray-50">
                  <td className="text-center p-5 text-md font-medium text-gray-900">{index + 1}</td>
                  <td className="p-5 text-md font-medium text-gray-900">{item.medicine_name}</td>
                  <td className="p-5 text-md font-medium text-gray-900">{item.description}</td>
                  <td className="p-5 text-md font-medium text-gray-900">0</td>
                  <td className="p-5 text-md font-medium text-gray-900">{item.in_stock}</td>
                  <td className="p-5 text-md font-medium text-gray-900">{item.sold}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-full group transition-all duration-500 flex items-center">
                        <FaRegEdit className='w-6 h-6 fill-indigo-500'/>
                      </button>
                      <button className="p-2 rounded-full group transition-all duration-500 flex items-center">
                        <RiDeleteBin6Line className='w-6 h-6 fill-red-600'/>
                      </button>
                      <button className="p-2 rounded-full group transition-all duration-500 flex items-center">
                        <BiDotsVerticalRounded className='w-6 h-6'/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Medicine;
