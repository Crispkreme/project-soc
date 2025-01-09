import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const ApproveMedicineRequesterModal = ({ showModal, toggleModal, selectedMedicineRequester }) => {
  const [processing, setProcessing] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await Inertia.post(
        route('medication.approve', { id: selectedMedicineRequester?.id })
      );
      toggleModal(true);
      toast.success("Medicine Request added successfully!");
    } catch (error) {
      toggleModal(true);
      toast.error("Please try again");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <div className="p-4">
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Title>Medicine Request Details</Title>
          <div className="mt-2">
            {selectedMedicineRequester ? (
              <>
                <div className="mt-4">
                  <InputLabel value="Medicine Name" />
                  <TextInput
                    value={selectedMedicineRequester?.patient_name || ''}
                    type="text"
                    className="w-full border p-2 rounded"
                    disabled
                  />
                </div>
                <div className="mt-4">
                  <InputLabel value="Medicine Name" />
                  <TextInput
                    value={selectedMedicineRequester?.medicine_name || ''}
                    type="text"
                    className="w-full border p-2 rounded"
                    disabled
                  />
                </div>
                <div className="mt-4">
                  <InputLabel value="Quantity" />
                  <TextInput
                    value={selectedMedicineRequester?.quantity || 'N/A'}
                    type="text"
                    className="w-full border p-2 rounded"
                    disabled
                  />
                </div>
                <div className="mt-4">
                  <InputLabel value="Reason" />
                  <Textarea
                    value={selectedMedicineRequester?.reason || 'N/A'}
                    className="mt-1 block w-full border rounded"
                    rows={5}
                    disabled
                  />
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <PrimaryButton onClick={submit} className="ml-4" disabled={processing}>
            {processing ? 'Processing...' : 'Approve'}
          </PrimaryButton>
          <button
            type="button"
            onClick={toggleModal}
            className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveMedicineRequesterModal;
