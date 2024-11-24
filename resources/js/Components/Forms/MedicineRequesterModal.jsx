import React, { lazy } from 'react';
import { useForm } from '@inertiajs/react';

const Modal = lazy(() => import("@/Components/Modals/Modal"));
const Title = lazy(() => import("@/Components/Headers/Title"));
const InputLabel = lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = lazy(() => import("@/Components/Inputs/Textarea"));
const InputError = lazy(() => import("@/Components/Inputs/InputError"));
const PrimaryButton = lazy(() => import("@/Components/Buttons/PrimaryButton"));
const ComboBox = lazy(() => import("@/Components/Inputs/ComboBox"));

const MedicineRequesterModal = ({ showModal, toggleModal, medicines, selectedReferral }) => {
  const { data, setData, post, processing, errors } = useForm({
    patient_id: selectedReferral?.id || '',
    medicines: [{ medicine_id: '', quantity: '' }],
    reason: '',
  });

  const addMedicineRow = () => {
    setData('medicines', [...data.medicines, { medicine_id: '', quantity: '' }]);
  };

  const removeMedicineRow = (index) => {
    if (data.medicines.length > 1) {
      const newMedicines = data.medicines.filter((_, i) => i !== index);
      setData('medicines', newMedicines);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...data.medicines];
    newMedicines[index][field] = value;
    setData('medicines', newMedicines);
  };

  const submit = (e) => {
    e.preventDefault();

    const url = selectedReferral
      ? route("medications.update", { id: selectedReferral.id })
      : route("medications.store");

    post(url, {
      onSuccess: () => toggleModal(false),
      onError: (errors) => console.error("Form Submission Error:", errors),
    });
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <form onSubmit={submit} className="p-6">
        <Title>Create Medication Request</Title>

        <div className="mt-4">
          <InputLabel value="Medicines" />
          {data.medicines.map((medicine, index) => (
            <div className="flex items-center gap-4 mb-4" key={index}>
              {/* Medicine field - wider */}
              <div className="flex-grow">
                <ComboBox
                  items={medicines}
                  value={medicines.find((med) => med.id === medicine.medicine_id)}
                  onChange={(selected) => handleMedicineChange(index, 'medicine_id', selected ? selected.id : '')}
                  placeholder="Select Medicine"
                  displayKey="medicine_name"
                />
                {errors.medicines?.[index]?.medicine_id && (
                  <InputError message={errors.medicines[index].medicine_id} />
                )}
              </div>

              {/* Quantity field */}
              <div className="col-md-3">
                <TextInput
                  value={medicine.quantity}
                  onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                  type="number"
                  className="w-full border p-2 rounded"
                  placeholder="Quantity"
                />
                {errors.medicines?.[index]?.quantity && (
                  <InputError message={errors.medicines[index].quantity} />
                )}
              </div>

              {/* Plus and Minus buttons inside the same button group */}
              <div className="flex justify-between items-center col-md-1">
                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="text-green-600 bg-green-200 p-2 rounded"
                >
                  +
                </button>
                {data.medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicineRow(index)}
                    className="text-red-600 bg-red-200 p-2 rounded"
                  >
                    -
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <InputLabel value="Reason" />
          <Textarea
            value={data.reason}
            onChange={(e) => setData("reason", e.target.value)}
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Enter reason for medication"
          />
          {errors.reason && <InputError message={errors.reason} />}
        </div>

        <div className="mt-4 flex justify-center">
          <PrimaryButton disabled={processing} className="px-8 py-2">
            {processing ? 'Saving...' : 'Save Request'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default MedicineRequesterModal;