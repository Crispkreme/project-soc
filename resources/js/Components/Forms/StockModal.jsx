import React, { useEffect, useState } from "react";
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const ComboBox = React.lazy(() => import("@/Components/Inputs/ComboBox"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));

const StockModal = ({ showModal, toggleModal, selectedInventory, medicines, isEditing, isViewing }) => {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors } = useForm({
        medicine_id: '',
        encode_by_id: user.id,
        usage: '',
        quantity: '',
    });

    const [selectedMedicine, setSelectedMedicine] = useState(null);

    useEffect(() => {
        if (showModal) {
            if (selectedInventory) {
                setData({
                    medicine_id: selectedInventory.medicine_id || "",
                    usage: selectedInventory.usage || "",
                    quantity: selectedInventory.quantity || "",
                    encode_by_id: selectedInventory.encode_by_id || user.id,
                    id: selectedInventory.id,
                });

                const med = medicines.find(m => m.id === selectedInventory.medicine_id);
                setSelectedMedicine(med || null);
            } else {
                setData({
                    medicine_id: "",
                    usage: "",
                    quantity: "",
                    encode_by_id: user.id,
                    id: undefined,
                });
                setSelectedMedicine(null);
            }
        }
    }, [showModal, selectedInventory, medicines, user.id]);

    const submit = (e) => {
        e.preventDefault();

        const isUpdating = isEditing && selectedInventory;
        const url = route(isUpdating ? "admin.update.medicines" : "admin.store.inventory", isUpdating ? selectedInventory.id : null);
        
        post(url, {
            data,
            onSuccess: (response) => {
                toggleModal(false);
                toast.success("Stock added successfully!");
              },
              onError: (errors) => {
                toggleModal(false);
                toast.error("An error occurred during Stock creation.");
              },
        });
    };

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <form onSubmit={submit} className="p-6">
                <Title>
                    {isViewing ? "View Medicine" : isEditing ? "Update Medicine" : "Add New Stock"}
                </Title>
                <input type="hidden" name="encode_by_id" value={user.id} />
                <div className="mt-4">
                    <InputLabel value="Medicine" />
                    <ComboBox
                        medicine={medicines}
                        value={selectedMedicine}
                        onChange={(med) => {
                            setSelectedMedicine(med);
                            setData("medicine_id", med?.id);
                        }}
                        placeholder="Choose a medicine"
                    />

                    {errors.medicine_id && <InputError message={errors.medicine_id} />}
                </div>

                <div className="mt-4">
                    <InputLabel value="Quantity" />
                    <TextInput
                        value={data.quantity}
                        onChange={(e) => setData("quantity", e.target.value)}
                        type="number"
                        className="w-full border p-2 rounded"
                        disabled={isViewing}
                    />
                    {errors.quantity && <InputError message={errors.quantity} />}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="usage" value="Usage" />
                    <Textarea
                        id="usage"
                        name="usage"
                        rows={5}
                        placeholder="What is the Medicine Usage"
                        value={data.usage}
                        onChange={(e) => setData("usage", e.target.value)}
                        className="mt-1 block w-full"
                        helperText="Tell us what this medicine is used for"
                        disabled={isViewing}
                    />
                    <InputError message={errors.usage} className="mt-2" />
                </div>

                <div className="mt-4">
                    <PrimaryButton type="submit" disabled={processing}>
                        {isEditing ? "Update" : "Save"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default StockModal;
