import React, { memo } from "react";
import { useForm } from "@inertiajs/react";
import GenericButton from "@/Components/Buttons/GenericButton";

const PrescriptionModal = memo(function AddPrescriptionModal({
  user_id,
  patient_name,
  patient_age = 25,
  doctor,
}) {
  const { data, setData, post, processing, errors } = useForm({
    prescription: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/prescriptions/${user_id}`, {
      onSuccess: () => console.log("Prescription added successfully"),
    });
  };

  return (
    <div className="modal-container"> {/* Ensure you have styles for this wrapper */}
      <form onSubmit={handleSubmit}>
        <div className="w-full bg-secondary-bg px-4 py-2">
          <h1 className="text-lg text-white">Add Prescription</h1>
        </div>
        <div className="px-4 py-2 font-light text-sm flex flex-col gap-4">
          <h1 className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</h1>
          <div className="flex flex-row w-full gap-32">
            <h1 className="text-sm text-gray-600">Patient: {patient_name}</h1>
            <h1 className="text-sm text-gray-600">Age: {patient_age}</h1>
          </div>
          <div className="mt-4">
            <div>
              <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
                Prescription
              </label>
              <textarea
                id="prescription"
                name="prescription"
                rows={5}
                placeholder="What will you prescribe?"
                value={data.prescription}
                onChange={(e) => setData("prescription", e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full"
              ></textarea>
              {errors.prescription && (
                <p className="text-sm text-red-600">{errors.prescription}</p>
              )}
              <p className="mt-3 text-sm text-gray-600">Tell us the prescription</p>
            </div>
          </div>
          <h1 className="text-sm text-gray-600">Interview: </h1>
          <h1 className="text-sm text-gray-600">Medicine Allergies: </h1>
          <h1 className="text-sm text-gray-600">Family History: </h1>
          <div className="flex flex-col justify-center pt-8 items-center">
            {doctor?.signature && (
              <img
                src={doctor.signature}
                alt="Doctor's Signature"
                height={10}
                width={100}
              />
            )}
            <h1>{doctor?.username || "Doctor's Name"}</h1>
          </div>
          <GenericButton
            type="submit"
            disabled={processing}
            className="self-center text-xs py-2 px-8 text-black"
          >
            {processing ? "Adding..." : "Add"}
          </GenericButton>
        </div>
      </form>
    </div>
  );
});

export default PrescriptionModal;
