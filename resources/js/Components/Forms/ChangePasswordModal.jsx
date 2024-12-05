import React from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));

const ChangePasswordModal = ({ showModal, toggleModal }) => {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        post(route('user.change.password', { id: user.id }), {
            onFinish: () => reset('current_password', 'new_password', 'new_password_confirmation'),
            onSuccess: (response) => {
                toggleModal(false);
                toast.success("Password updated successfully!");
              },
              onError: (errors) => {
                toggleModal(false);
                toast.error("An error occurred during Password creation.");
              },
        });
    };

    const handleClose = () => {
        toggleModal();
    };

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="mt-7 rounded-xl transform">
                <div className="p-4 sm:p-7">
                    <Title>Change Account Password</Title>

                    <div className="mt-5">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-4">
                                <div>
                                    <InputLabel htmlFor="current_password" value="Current Password" />
                                    <div className="relative">
                                        <TextInput
                                            id="current_password"
                                            type="password"
                                            name="current_password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="mt-1 block w-full"
                                            autoComplete="current_password"
                                            required
                                        />
                                        {errors.current_password && (
                                            <InputError message={errors.current_password} className="mt-2" />
                                        )}
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <div>
                                        <InputLabel htmlFor="new_password" value="New Password" />
                                        <div className="relative">
                                            <TextInput
                                                id="new_password"
                                                type="password"
                                                name="new_password"
                                                value={data.new_password}
                                                onChange={(e) => setData('new_password', e.target.value)}
                                                className="mt-1 block w-full"
                                                autoComplete="new_password"
                                                required
                                            />
                                            {errors.new_password && (
                                                <InputError message={errors.new_password} className="mt-2" />
                                            )}
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <InputLabel htmlFor="new_password_confirmation" value="Confirm Password" />
                                        <div className="relative">
                                            <TextInput
                                                id="new_password_confirmation"
                                                type="password"
                                                name="new_password_confirmation"
                                                value={data.new_password_confirmation}
                                                onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                                className="mt-1 block w-full"
                                                autoComplete="new_password_confirmation"
                                                required
                                            />
                                            {errors.new_password_confirmation && (
                                                <InputError message={errors.new_password_confirmation} className="mt-2" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-semibold bg-indigo-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 transition-all duration-300 hover:scale-[1.02] dark:focus:ring-offset-gray-800"
                                    disabled={processing}
                                >
                                    {processing ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChangePasswordModal;
