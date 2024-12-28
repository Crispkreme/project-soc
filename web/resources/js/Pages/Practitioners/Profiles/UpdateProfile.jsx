import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { TbUserHexagon } from "react-icons/tb";

const PatientLayout = React.lazy(() => import("@/Layouts/PatientLayout"));
const InputError = React.lazy(() => import("@/Components/Inputs/InputError"));
const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const Select = React.lazy(() => import("@/Components/Inputs/Select"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));
const PrimaryButton = React.lazy(() => import("@/Components/Buttons/PrimaryButton"));
const ChangePasswordModal = React.lazy(() => import("@/Components/Forms/ChangePasswordModal"));
const ChangeEmailModal = React.lazy(() => import("@/Components/Forms/ChangeEmailModal"));
const DeactivateAccountModal = React.lazy(() => import("@/Components/Forms/DeactivateAccountModal"));
const UpdateAvatar = React.lazy(() => import("@/Components/Profiles/UpdateAvatar"));

const UpdateProfile = ({ userDetail }) => {

    const user = usePage().props.auth.user;
    const username = user.username;
    const profile = userDetail.profile;

    const [activeModal, setActiveModal] = useState(null);
    const selectRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: '',
        middlename: '',
        lastname: '',
        gender: '',
        birthday: '',
        religion: '',
        address: '',
        civil_status: '',
        profile: '',
    });

    useEffect(() => {
        if (userDetail) {
            setData({
                id: userDetail.id || null,
                firstname: userDetail.firstname || '',
                middlename: userDetail.middlename || '',
                lastname: userDetail.lastname || '',
                gender: userDetail.gender || '',
                birthday: userDetail.birthday || '',
                religion: userDetail.religion || '',
                address: userDetail.address || '',
                civil_status: userDetail.civil_status || '',
                profile: userDetail.profile || '',
            });
        }
        
    }, [userDetail]);

    const submit = (e) => {
        e.preventDefault();

        setData((prevData) => ({
          ...prevData,
          id: userDetail?.id ?? undefined, 
        }));
        
        post(route("practitioner.profile.update", userDetail.user_id), {
            data: {
                ...data,
            },
            onError: (errors) => setErrors(errors),
        });
    };

    const handleChange = (field, value) => {
        setData((prevData) => ({ ...prevData, [field]: value }));
    };

    const openChangePasswordModal = () => {
        setActiveModal('changePassword');
    };

    const openChangeEmailModal = () => {
        setActiveModal('changeEmail');
    };

    const openDeactivateAccountModal = () => {
        setActiveModal('deactivateAccount');
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const genderOptions = [
        { value: '', label: 'Select Gender', disabled: true },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' }
    ];

    const civilStatusOptions = [
        { value: '', label: 'Select Civil Status', disabled: true },
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
        { value: 'Separated', label: 'Separated' },
        { value: 'Divorce', label: 'Divorce' }
    ];

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
    
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        const ageMonth = today.getMonth() - birthDate.getMonth();
    
        if (ageMonth < 0 || (ageMonth === 0 && today.getDate() < birthDate.getDate())) {
            ageYears--;
        }

        return ageYears;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientLayout>
                <Head title="Accounts" />

                <div className="space-y-4 flex flex-wrap">
                    <div className="bg-white p-8 m-4 rounded-lg shadow-md flex-1 md:w-9/12">
                        <Title>Account Details</Title>

                        <UpdateAvatar userDetail={userDetail}/>
                        
                        <form onSubmit={submit}>
                            <input type="hidden" name="id" value={data.id} />
                            <input type="hidden" name="user_id" value={data.user_id} />

                            <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                <div className="w-full mb-4 mt-6">
                                    <input type="hidden" value={data.profile} onChange={(e) => handleChange('profile', e.target.value)} />
                                    <InputLabel htmlFor="firstname" value="Firstname" />
                                    <TextInput
                                        id="firstname"
                                        type="text"
                                        name="firstname"
                                        value={data.firstname}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => handleChange('firstname', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.firstname} className="mt-2" />
                                </div>
                                <div className="w-full mb-4 lg:mt-6">
                                    <InputLabel htmlFor="middlename" value="Middlename" />
                                    <TextInput
                                        id="middlename"
                                        type="text"
                                        name="middlename"
                                        value={data.middlename}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => handleChange('middlename', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.middlename} className="mt-2" />
                                </div>
                                <div className="w-full mb-4 lg:mt-6">
                                    <InputLabel htmlFor="lastname" value="Lastname" />
                                    <TextInput
                                        id="lastname"
                                        type="text"
                                        name="lastname"
                                        value={data.lastname}
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => handleChange('lastname', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.lastname} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full mb-4">
                                <div className="w-full">
                                    <InputLabel htmlFor="gender" value="Gender" />
                                    <Select
                                        ref={selectRef}
                                        options={genderOptions}
                                        name="gender"
                                        value={data.gender}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                        className="w-full mt-1"
                                    />
                                    <InputError message={errors.gender} className="mt-2" />
                                </div>
                                <div className="w-full">
                                    <InputLabel htmlFor="civil_status" value="Civil Status" />
                                    <Select
                                        ref={selectRef}
                                        options={civilStatusOptions}
                                        name="civil_status"
                                        value={data.civil_status}
                                        onChange={(e) => handleChange('civil_status', e.target.value)}
                                        className="w-full mt-1"
                                    />
                                    <InputError message={errors.civil_status} className="mt-2" />
                                </div>
                                <div className="w-full">
                                    <InputLabel htmlFor="birthday" value="Date of Birth" />
                                    <TextInput
                                        id="birthday"
                                        type="date"
                                        name="birthday"
                                        value={data.birthday}
                                        className="mt-1 block w-full"
                                        autoComplete="birthday"
                                        onChange={(e) => handleChange('birthday', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.birthday} className="mt-2" />
                                </div>
                                <div className="w-full">
                                    <InputLabel htmlFor="age" value="Age" />
                                    <TextInput
                                        id="age"
                                        type="text"
                                        name="age"
                                        value={calculateAge(data.birthday)}
                                        className="mt-1 block w-full"
                                        autoComplete="age"
                                        disabled
                                    />
                                    <InputError message={errors.birthday} className="mt-2" />
                                </div>
                            </div>

                            <div className="mb-4 flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="religion" value="Religion" />
                                    <TextInput
                                        id="religion"
                                        type="text"
                                        name="religion"
                                        value={data.religion}
                                        className="mt-1 block w-full"
                                        autoComplete="religion"
                                        onChange={(e) => handleChange('religion', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.religion} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                                <div className="w-full">
                                    <InputLabel htmlFor="address" value="Address" />
                                    <Textarea
                                        id="address"
                                        name="address"
                                        rows={5}
                                        placeholder="Address"
                                        value={data.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className="mt-4 block w-full"
                                        helperText="Input your current address"
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                </div>
                            </div>

                            <div className='w-full flex justify-end mt-8'>
                                <PrimaryButton className="ms-4">
                                    Update Account Details
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-8 m-4 rounded-lg shadow-md md:w-3/12">
                        <div className="px-4 pb-6">
                            <div className="text-center my-4">

                                <div
                                    className="mx-auto flex justify-center w-[141px] h-[141px] rounded-full"
                                    style={{
                                        backgroundImage: `url("/storage/${data.profile}")`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />

                                <div className="py-2">
                                    <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">{data.firstname} {data.middlename} {data.lastname}</h3>
                                    <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                                        <TbUserHexagon className='h-5 w-5 text-gray-400 dark:text-gray-600 mr-1'/>
                                        {user.role}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 px-2 h-full">
                                <button
                                    className="rounded-full bg-blue-900 text-white hover:text-white antialiased font-bold hover:bg-blue-800 active:bg-blue-900 active:border-blue-500 px-4 py-2">
                                    Account Details
                                </button>
                                <button
                                    onClick={openChangePasswordModal}
                                    className="mt-auto rounded-full border-2 border-black-400 font-semibold text-black hover:text-white hover:border-blue-600 hover:bg-blue-900 active:bg-blue-600 active:border-blue-600 active:text-white px-4 py-2">
                                    Change Password
                                </button>
                                <button
                                    onClick={openChangeEmailModal}
                                    className="mt-auto rounded-full border-2 border-black-400 font-semibold text-black hover:text-white hover:border-blue-600 hover:bg-blue-900 active:bg-blue-600 active:border-blue-600 active:text-white px-4 py-2">
                                    Change Email
                                </button>
                                <button 
                                    onClick={openDeactivateAccountModal}
                                    className="mt-auto rounded-full border-2 border-black-400 font-semibold text-black hover:text-white hover:border-blue-600 hover:bg-blue-900 active:bg-blue-600 active:border-blue-600 active:text-white px-4 py-2">
                                    Deactivate Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {activeModal === 'changePassword' && (
                    <ChangePasswordModal showModal={true} toggleModal={closeModal} />
                )}

                {activeModal === 'changeEmail' && (
                    <ChangeEmailModal showModal={true} toggleModal={closeModal} />
                )}

                {activeModal === 'deactivateAccount' && (
                    <DeactivateAccountModal showModal={true} toggleModal={closeModal} />
                )}

            </PatientLayout>
        </Suspense>
    );
};

export default UpdateProfile;
