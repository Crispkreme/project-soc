import React from 'react';

const Modal = React.lazy(() => import("@/Components/Modals/Modal"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));

const ChangeEmailModal = ({ showModal, toggleModal }) => {
    const handleClose = () => {
        toggleModal();
    };

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="mt-7 rounded-xl transform">
                <div className="p-4 sm:p-7">

                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                        <button type="button" data-behavior="cancel" onClick={handleClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-indigo-800 dark:text-white mb-2">Change Email</h1>
                    </div>

                    <div className="mt-5">
                        <form onsubmit="handleSubmit(event)">
                            <div className="grid gap-y-4">
                                <div>
                                    <InputLabel htmlFor="email" value="Current Email Address" />
                                    <div className="relative">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value=""
                                            className="mt-1 block w-full"
                                            autoComplete="email"
                                            // onChange={(e) => handleChange('email', e.target.value)}
                                            required
                                        />
                                        {/* <InputError message={errors.email} className="mt-2" /> */}
                                    </div>
                                    <p className="hidden text-xs text-red-600 dark:text-red-400 mt-2" id="email-error">
                                        Please include a valid email address so we can get back to you
                                    </p>
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="New Email Address" />
                                    <div className="relative">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value=""
                                            className="mt-1 block w-full"
                                            autoComplete="email"
                                            // onChange={(e) => handleChange('email', e.target.value)}
                                            required
                                        />
                                        {/* <InputError message={errors.email} className="mt-2" /> */}
                                    </div>
                                    <p className="hidden text-xs text-red-600 dark:text-red-400 mt-2" id="email-error">
                                        Please include a valid email address so we can get back to you
                                    </p>
                                </div>
                                <button 
                                    type="submit" 
                                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-semibold bg-indigo-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 transition-all duration-300 hover:scale-[1.02] dark:focus:ring-offset-gray-800"
                                >
                                    Change Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ChangeEmailModal