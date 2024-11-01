import React from 'react';

const SecondaryButton = React.lazy(() => import("@/Components/Buttons/SecondaryButton"));
const DangerButton = React.lazy(() => import("@/Components/Buttons/DangerButton"));

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <DangerButton className="ml-2" onClick={onConfirm}>Delete</DangerButton>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
