import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));

const PatientRecord = ({ medicalRecords, hospitalizations, immunizations, testResults }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout>

        <Head title="Patient Record" />

        <div className='grid grid-cols-1 gap-6 mb-6'>
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">

          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Manage Patient Record</div>
          </div>

          <div className='p-4 bg-gray-200 rounded-lg mb-4'>
            <Accordion title='Test Result'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                      <thead>
                        <tr>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Test</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Result</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.length > 0 ? testResults.map((testResult) => (
                          <tr key={testResults.id}>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{testResult.name}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{testResult.result}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{format(new Date(testResult.created_at), "MMMM d, yyyy")}</span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">No Test Result Available.</td>
                          </tr>
                        )}      
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

          <div className='p-4 bg-gray-200 rounded-lg mb-4'>
            <Accordion title='Immunization Records'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                      <thead>
                        <tr>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Immunization</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Doctor</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {immunizations.length > 0 ? immunizations.map((immunization) => (
                          <tr key={immunization.id}>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{immunization.immunization}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{immunization.doctor_name}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{format(new Date(immunization.created_at), "MMMM d, yyyy")}</span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">No Immunization Available.</td>
                          </tr>
                        )}      
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
          
          <div className='p-4 bg-gray-200 rounded-lg mb-4'>
            <Accordion title='Hospitalization Records'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                      <thead>
                        <tr>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Diagnosis</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Hospital</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Doctor</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hospitalizations.length > 0 ? hospitalizations.map((hospitalization) => (
                          <tr key={hospitalization.id}>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{hospitalization.diagnosis}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{hospitalization.hospital_name}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{hospitalization.doctor_name}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{format(new Date(hospitalization.created_at), "MMMM d, yyyy")}</span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">No Hospitalization Available.</td>
                          </tr>
                        )}      
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

          <div className='p-4 bg-gray-200 rounded-lg'>
            <Accordion title='Personal Medical Records'>
              <div className='grid grid-cols-1 gap-6 mb-6'>
                <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                      <thead>
                        <tr>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Diagnosis</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Medication</th>
                          <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicalRecords.length > 0 ? medicalRecords.map((medicalRecord) => (
                          <tr key={medicalRecord.id}>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{medicalRecord.diagnosis}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{medicalRecord.medicine.medicine_name}</span>
                            </td>
                            <td className="py-2 px-4 border-b border-b-gray-50">
                              <span className="text-[13px] font-medium text-gray-400">{format(new Date(medicalRecord.created_at), "MMMM d, yyyy")}</span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="text-center py-4 text-gray-500">No Medical Available.</td>
                          </tr>
                        )}      
                      </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>

          </div>
        </div>

      </AdminLayout>
    </Suspense>
  )
}

export default PatientRecord
