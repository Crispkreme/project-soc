import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdateProfile from '@/Components/Profiles/UpdateProfile';

const Profile = ({ userDetail }) => {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile Information
                </h2>
            }
        >
            <Head title="Profile Information" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfile
                            userDetail={userDetail}
                            className="max-w-xl"
                        />
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
};

export default Profile;
