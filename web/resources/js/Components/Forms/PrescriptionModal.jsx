import { lazy, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";

const Modal = lazy(() => import("@/Components/Modals/Modal"));
const Title = lazy(() => import("@/Components/Headers/Title"));
const InputLabel = lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = lazy(() => import("@/Components/Inputs/Textarea"));
const InputError = lazy(() => import("@/Components/Inputs/InputError"));
const PrimaryButton = lazy(() => import("@/Components/Buttons/PrimaryButton"));
const ComboBox = lazy(() => import("@/Components/Inputs/ComboBox"));

const PrescriptionModal = ({ showModal, toggleReferralModal, selectedReferral }) => {

  const { data, setData, post, processing, errors } = useForm({
    doctor_id: "",
    patient_id: selectedReferral ? selectedReferral.patient_id : "",
    medicines: [{ medicine_id: "", quantity: "" }],
    instruction: "",
    diagnosis: "",
  });

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const addMedicineRow = () => {
    setData("medicines", [...data.medicines, { medicine_id: "", quantity: "" }]);
  };

  const removeMedicineRow = (index) => {
    if (data.medicines.length > 1) {
      const newMedicines = data.medicines.filter((_, i) => i !== index);
      setData("medicines", newMedicines);
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...data.medicines];
    newMedicines[index][field] = value;
    setData("medicines", newMedicines);
  };

  const fetchMedicines = async () => {
    if (!showModal) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/mobile/get/all/medicine/inventory");
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchMedicines();
    }
  }, [showModal]);

  const submit = (e) => {
    e.preventDefault();

    const url = selectedReferral
      ? route("prescription.update", { id: selectedReferral.id })
      : route("prescription.create");

    post(url, {
      onSuccess: () => {
        setData({
          doctor_id: "",
          patient_id: selectedReferral ? selectedReferral.patient_id : "",
          medicines: [{ medicine_id: "", quantity: "" }],
          instruction: "",
          diagnosis: "",
        });

        toggleModal(false); // Close the modal
        toast.success("Prescription added successfully!");
      },
      onError: () => {
        toast.error("An error occurred during prescription creation.");
      },
    });
  };

  const handleQuantityChange = (index, value) => {
    const selectedMedicine = medicines.find(
      (med) => med.id === data.medicines[index].medicine_id
    );

    if (selectedMedicine && value > selectedMedicine.in_stock) {
      toast.error(`Not enough stock! Available stock: ${selectedMedicine.in_stock}`);
      return;
    }

    handleMedicineChange(index, 'quantity', value);
    handleMedicineChange(index, 'medicine_id', value);
  };

  return (
    <Modal show={showModal} onClose={() => toggleModal(false)}>
      <form onSubmit={submit} className="p-6">
        <Title>Create Prescription</Title>

        <div className="mt-4">
          <InputLabel value="Patient" />
          <TextInput
            value={selectedReferral?.patient_name || ""}
            type="text"
            className="w-full border p-2 rounded"
            disabled
            placeholder="Select a Patient"
          />
        </div>

        <div className="mt-4">
          <InputLabel value="Medicines" />
          {data.medicines.map((medicine, index) => {
            const selectedMedicine = medicines.find((med) => med.id === medicine.medicine_id);
            const inStock = selectedMedicine ? selectedMedicine.in_stock : 0;

            return (
              <div className="flex items-center gap-4 mb-4" key={index}>
                <div className="flex-grow">
                  <input
                    type="hidden"
                    name={`medicines[${index}][medicine_id]`}
                    value={medicine.medicine_id || ""}
                  />
                  <ComboBox
                    items={medicines}
                    value={medicines.find((med) => med.id === medicine.medicine_id)}
                    onChange={(selected) => {
                      handleMedicineChange(index, "medicine_id", selected ? selected.id : "");
                    }}
                    placeholder="Select Medicine"
                    displayKey="medicine_name"
                  />
                  {errors.medicines?.[index]?.medicine_id && (
                    <InputError message={errors.medicines[index].medicine_id} />
                  )}
                </div>

                <div className="col-md-3">
                  <TextInput
                    value={medicine.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    type="number"
                    className="w-full border p-2 rounded"
                    placeholder="Quantity"
                  />
                  {errors.medicines?.[index]?.quantity && (
                    <InputError message={errors.medicines[index].quantity} />
                  )}
                </div>

                <div className="col-md-2">
                  {selectedMedicine && (
                    <p className="text-sm text-gray-600">
                      Available Stock: {inStock}
                    </p>
                  )}
                </div>

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
            );
          })}
        </div>

        <div className="mt-4">
          <InputLabel value="Diagnosis" />
          <Textarea
            value={data.diagnosis}
            onChange={(e) => setData("diagnosis", e.target.value)}
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Enter prescription diagnosis"
          />
          {errors.diagnosis && <InputError message={errors.diagnosis} />}
        </div>

        <div className="mt-4">
          <InputLabel value="Instruction" />
          <Textarea
            value={data.instruction}
            onChange={(e) => setData("instruction", e.target.value)}
            rows={5}
            className="w-full border p-2 rounded"
            placeholder="Enter prescription instructions"
          />
          {errors.instruction && <InputError message={errors.instruction} />}
        </div>

        <div className="mt-4 flex justify-center">
          <PrimaryButton disabled={processing} className="px-8 py-2">
            {processing ? "Saving..." : "Save Prescription"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default PrescriptionModal;
