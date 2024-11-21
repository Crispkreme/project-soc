import React from 'react';
import { usePage, useForm } from '@inertiajs/react';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const ChangePasswordModal = ({ showModal, toggleModal }) => {
    const user = usePage().props.auth.user;
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        post(route('admin.update.user.password', { id: user.id }), {
            onFinish: () => reset('current_password', 'new_password', 'new_password_confirmation'),
        });
    };

    const handleClose = () => {
        toggleModal();
    };

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="mt-7 rounded-xl transform">
                <div className="p-4 sm:p-7">
                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            data-behavior="cancel"
                            onClick={handleClose}
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-indigo-800 dark:text-white mb-2">Change Password</h1>
                    </div>

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
