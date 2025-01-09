import axios from 'axios';
import { lazy, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

const Modal = lazy(() => import("@/Components/Modals/Modal"));
const Title = lazy(() => import("@/Components/Headers/Title"));
const InputLabel = lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = lazy(() => import("@/Components/Inputs/Textarea"));
const InputError = lazy(() => import("@/Components/Inputs/InputError"));
const PrimaryButton = lazy(() => import("@/Components/Buttons/PrimaryButton"));
const ComboBox = lazy(() => import("@/Components/Inputs/ComboBox"));

const MedicineRequesterModal = ({ showModal, toggleModal, selectedReferral, medicines }) => {
  
  const [loading, setLoading] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    patient_id: selectedReferral?.id || '',
    medicines: [{ medicine_id: '', quantity: '', stockAvailable: 0 }],
    reason: '',
  });

  const addMedicineRow = () => {
    setData('medicines', [...data.medicines, { medicine_id: '', quantity: '', stockAvailable: 0 }]);
  };

  const removeMedicineRow = (index) => {
    if (data.medicines.length > 1) {
      const updatedMedicines = data.medicines.filter((_, i) => i !== index);
      setData('medicines', updatedMedicines);
    }
  };

  const handleMedicineChange = async (index, field, value) => {
    const updatedMedicines = [...data.medicines];
    if (field === 'medicine_id' && value) {
      try {
        setLoading(true);
        const response = await axios.get(`/get/medicines/quantity/${value}`);
        const selectedMedicine = response.data.medicines;

        if (selectedMedicine) {
          updatedMedicines[index] = {
            ...updatedMedicines[index],
            medicine_id: value,
            quantity: updatedMedicines[index].quantity || selectedMedicine.in_stock,
            stockAvailable: selectedMedicine.in_stock,
          };
          toast.success(`Loaded ${selectedMedicine.in_stock} units in stock.`);
        }
      } catch (error) {
        console.error('Error fetching medicine details:', error);
        toast.error('Failed to fetch medicine details.');
      } finally {
        setLoading(false);
      }
    } else if (field === 'quantity') {
      const stockAvailable = updatedMedicines[index].stockAvailable;

      if (value > stockAvailable) {
        updatedMedicines[index].quantity = stockAvailable;
        toast.error(`Only ${stockAvailable} units available in stock.`);
      } else {
        updatedMedicines[index].quantity = value;
      }
    } else {
      updatedMedicines[index][field] = value;
    }

    setData('medicines', updatedMedicines);
  };

  const submit = (e) => {
    e.preventDefault();

    const url = selectedReferral
      ? route("medications.update", { id: selectedReferral.id })
      : route("medications.store");

    post(url, {
      onSuccess: () => {
        toggleModal(false);
        toast.success("Medicine Request added successfully!");
      },
      onError: () => {
        toast.error("An error occurred during medicine request creation.");
      },
    });
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <form onSubmit={submit} className="p-6">
        <Title>Create Medication Request</Title>

        <div className="mt-4">
          <InputLabel value="Medicines" />
          {data.medicines.map((medicine, index) => {
            const stockAvailable = medicine.stockAvailable || 0;

            return (
              <div className="flex items-center gap-4 mb-4" key={index}>
                <div className="flex-grow">
                  <ComboBox
                    items={Object.values(medicines)}
                    value={Object.values(medicines).find((med) => med.medicine_id === medicine.medicine_id)}
                    onChange={(selected) => handleMedicineChange(index, 'medicine_id', selected?.medicine_id || '')}
                    placeholder="Select Medicine"
                    displayKey="medicine_name"
                  />
                  {errors.medicines?.[index]?.medicine_id && (
                    <InputError message={errors.medicines[index].medicine_id} />
                  )}
                </div>

                <div className="w-1/4">
                  <TextInput
                    value={medicine.quantity}
                    onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder={`Max: ${stockAvailable}`}
                  />
                  {errors.medicines?.[index]?.quantity && (
                    <InputError message={errors.medicines[index].quantity} />
                  )}
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="text-green-600 bg-green-200 p-2 rounded"
                    title="Add medicine row"
                  >
                    +
                  </button>
                  {data.medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(index)}
                      className="text-red-600 bg-red-200 p-2 rounded"
                      title="Remove medicine row"
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <InputLabel value="Reason" />
          <Textarea
            value={data.reason}
            onChange={(e) => setData('reason', e.target.value)}
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Enter reason for medication"
          />
          {errors.reason && <InputError message={errors.reason} />}
        </div>

        <div className="mt-4 flex justify-center">
          <PrimaryButton disabled={processing || loading} className="px-8 py-2">
            {processing || loading ? 'Saving...' : 'Request Medicine'}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default MedicineRequesterModal;