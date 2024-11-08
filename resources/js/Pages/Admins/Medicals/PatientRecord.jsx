import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

const AdminLayout = React.lazy(() => import("@/Layouts/AdminLayout"));
const Accordion = React.lazy(() => import("@/Components/Accordion"));

const PatientRecord = ({ patient, medicalRecords, hospitalizations, immunizations, healthRecords, surgicalRecords, medicationRecords, familyMedicalRecords, testResults }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLayout>

        <Head title="Patient Record" />

        <div className='grid grid-cols-1 gap-6 mb-6'>
          <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">

            <div className="flex justify-between mb-4 items-start">
              <div className="font-medium">Manage Records</div>
            </div>

            <div className='p-4 bg-gray-200 rounded-lg mb-4'>
              <Accordion title='Health History'>
                <div className='grid grid-cols-1 gap-6 mb-6'>
                  <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                        <thead>
                          <tr>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Illness</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Illness Description</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {healthRecords.length > 0 ? healthRecords.map((healthRecord) => (
                            <tr key={healthRecord.id}>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{healthRecord.name}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{healthRecord.description}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{format(new Date(healthRecord.created_at), "MMMM d, yyyy")}</span>
                              </td>
                              <td className="py-2 px-2 border-b border-b-gray-50">
                                <div className="flex space-x-2">
                                  {/* <WarningButton onClick={() => openViewModal(inventory)}>
                                    <SlEyeglass />
                                  </WarningButton>
                                  <SecondaryButton onClick={() => openEditModal(inventory)}>
                                    <LuClipboardEdit />
                                  </SecondaryButton>
                                  <DangerButton>
                                    <RiDeleteBin5Line />
                                  </DangerButton> */}
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={5} className="text-center py-4 text-gray-500">No Health History Available.</td>
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
              <Accordion title='Surgical History'>
                <div className='grid grid-cols-1 gap-6 mb-6'>
                  <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                        <thead>
                          <tr>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Surgery</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Procedure</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Doctor</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {surgicalRecords.length > 0 ? surgicalRecords.map((surgicalRecord) => (
                            <tr key={surgicalRecord.id}>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{surgicalRecord.procedure}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{surgicalRecord.description}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{surgicalRecord.doctor_name}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{format(new Date(surgicalRecord.created_at), "MMMM d, yyyy")}</span>
                              </td>
                              <td className="py-2 px-2 border-b border-b-gray-50">
                                <div className="flex space-x-2">
                                  {/* <WarningButton onClick={() => openViewModal(inventory)}>
                                    <SlEyeglass />
                                  </WarningButton>
                                  <SecondaryButton onClick={() => openEditModal(inventory)}>
                                    <LuClipboardEdit />
                                  </SecondaryButton>
                                  <DangerButton>
                                    <RiDeleteBin5Line />
                                  </DangerButton> */}
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-gray-500">No Surgical History Available.</td>
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
              <Accordion title='Medication History'>
                <div className='grid grid-cols-1 gap-6 mb-6'>
                  <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                        <thead>
                          <tr>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Medicine Name</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Dosage</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Reason/For:</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicationRecords.length > 0 ? medicationRecords.map((medicationRecord) => (
                            <tr key={medicationRecord.id}>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{medicationRecord.medicine.medicine_name}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{medicationRecord.dosage}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{medicationRecord.reason}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{format(new Date(medicationRecord.created_at), "MMMM d, yyyy")}</span>
                              </td>
                              <td className="py-2 px-2 border-b border-b-gray-50">
                                <div className="flex space-x-2">
                                  {/* <WarningButton onClick={() => openViewModal(inventory)}>
                                    <SlEyeglass />
                                  </WarningButton>
                                  <SecondaryButton onClick={() => openEditModal(inventory)}>
                                    <LuClipboardEdit />
                                  </SecondaryButton>
                                  <DangerButton>
                                    <RiDeleteBin5Line />
                                  </DangerButton> */}
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-gray-500">No Medication History Available.</td>
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
              <Accordion title='Family Medical History'>
                <div className='grid grid-cols-1 gap-6 mb-6'>
                  <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                        <thead>
                          <tr>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Desease</th>
                            <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Relationship</th>
                          </tr>
                        </thead>
                        <tbody>
                          {familyMedicalRecords.length > 0 ? familyMedicalRecords.map((familyMedicalRecord) => (
                            <tr key={familyMedicalRecords.id}>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{familyMedicalRecord.disease}</span>
                              </td>
                              <td className="py-2 px-4 border-b border-b-gray-50">
                                <span className="text-[13px] font-medium text-gray-400">{familyMedicalRecord.relationship_disease}</span>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="text-center py-4 text-gray-500">No Family Medical History Available.</td>
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
              <Accordion title='Hospital Records'>
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

            <div className='p-4 bg-gray-200 rounded-lg mb-4'>
              <Accordion title='Hospital Records'>
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
              <Accordion title='Medical Records'>
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
