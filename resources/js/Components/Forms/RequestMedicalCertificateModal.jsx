import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modals/Modal";

const RequestMedicalCertificateModal = ({ isOpen, onClose, doctors }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        purpose: "",
        doctor_id: "",
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("medical.certificate.request"), {
            onSuccess: () => {
                handleClose();
            },
            onError: (errors) => {
                console.error("An error occurred:", errors);
            },
            data, // Passing data directly here
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">Request Medical Certificate</h3>

                <div>
                    <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-700">
                        Doctor's Name
                    </label>
                    <select
                        id="doctor_name"
                        name="doctor_id"
                        value={data.doctor_id}
                        onChange={(e) => setData("doctor_id", e.target.value)}
                        className={`block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.doctor_id ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                    {errors.doctor_id && <p className="mt-1 text-sm text-red-500">{errors.doctor_id}</p>}
                </div>

                <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                        Purpose
                    </label>
                    <textarea
                        id="purpose"
                        name="purpose"
                        value={data.purpose}
                        onChange={(e) => setData("purpose", e.target.value)}
                        rows="4"
                        className={`block w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.purpose ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Enter the purpose"
                    />
                    {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        disabled={processing}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={processing}
                    >
                        {processing ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RequestMedicalCertificateModal;
