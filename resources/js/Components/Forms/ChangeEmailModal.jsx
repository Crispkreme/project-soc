import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const ChangeEmailModal = ({ showModal, toggleModal }) => {
    const [formData, setFormData] = useState({
        current_email: '',
        new_email: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
        setProcessing(true);

        try {
            const response = await axios.post('/user/change/email', formData);
            setSuccessMessage(response.data.message || 'Email updated successfully.');
            setProcessing(false);
            toggleModal(false);
            toast.success("Email Change successfully!");
        } catch (error) {
            setProcessing(false);
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                toggleModal(false);
                toast.success("An unexpected error occurred. Please try again.!");
            }
        }
    };

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="mt-7 rounded-xl transform">
                <div className="p-4 sm:p-7">
                    <Title>Change Account Email</Title>

                    {successMessage && (
                        <div className="mb-4 text-green-600 font-semibold">
                            {successMessage}
                        </div>
                    )}

                    <div className="mt-5">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-4">
                                <div>
                                    <InputLabel htmlFor="current_email" value="Current Email Address" />
                                    <div className="relative">
                                        <TextInput
                                            id="current_email"
                                            type="email"
                                            name="current_email"
                                            value={formData.current_email}
                                            className="mt-1 block w-full"
                                            autoComplete="email"
                                            onChange={(e) => handleChange('current_email', e.target.value)}
                                            required
                                        />
                                        {errors.current_email && (
                                            <InputError message={errors.current_email[0]} className="mt-2" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="new_email" value="New Email Address" />
                                    <div className="relative">
                                        <TextInput
                                            id="new_email"
                                            type="email"
                                            name="new_email"
                                            value={formData.new_email}
                                            className="mt-1 block w-full"
                                            autoComplete="email"
                                            onChange={(e) => handleChange('new_email', e.target.value)}
                                            required
                                        />
                                        {errors.new_email && (
                                            <InputError message={errors.new_email[0]} className="mt-2" />
                                        )}
                                    </div>
                                </div>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {processing ? 'Processing...' : 'Change Email'}
                                </PrimaryButton>
                            </div>
                            {errors.general && (
                                <div className="mt-4 text-red-600 font-semibold">
                                    {errors.general}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChangeEmailModal;
