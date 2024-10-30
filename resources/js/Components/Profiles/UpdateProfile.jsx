import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import Select from "@/Components/Inputs/Select";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import TextInput from "@/Components/Inputs/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";

const UpdateProfile = ({ userDetail, className = "" }) => {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            id: userDetail.id,
            user_id: userDetail.user_id,
            firstname: userDetail.firstname,
            middlename: userDetail.middlename,
            lastname: userDetail.lastname,
            gender: userDetail.gender,
            birthday: userDetail.birthday,
            civil_status: userDetail.civil_status,
            religion: userDetail.religion,
            profile: userDetail.profile,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("patient.profile.update", userDetail.id));
    };

    const genderOptions = [
        { value: "", label: "Select Gender", disabled: true },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
    ];

    const civilStatusOptions = [
        { value: "", label: "Select Civil Status", disabled: true },
        { value: "Single", label: "Single" },
        { value: "Married", label: "Married" },
        { value: "Divorce", label: "Divorce" },
        { value: "Separated", label: "Separated" },
    ];

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <input
                    type="hidden"
                    value={userDetail.user_id}
                    name="user_id"
                />
                <div>
                    <InputLabel htmlFor="firstname" value="Firstname" />
                    <TextInput
                        id="firstname"
                        className="mt-1 block w-full"
                        value={data.firstname}
                        onChange={(e) => setData("firstname", e.target.value)}
                        required
                        isFocused
                        autoComplete="firstname"
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>
                <div>
                    <InputLabel htmlFor="middlename" value="Middlename" />
                    <TextInput
                        id="middlename"
                        className="mt-1 block w-full"
                        value={data.middlename}
                        onChange={(e) => setData("middlename", e.target.value)}
                        required
                        isFocused
                        autoComplete="middlename"
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>
                <div>
                    <InputLabel htmlFor="lastname" value="Lastname" />
                    <TextInput
                        id="lastname"
                        className="mt-1 block w-full"
                        value={data.lastname}
                        onChange={(e) => setData("lastname", e.target.value)}
                        required
                        isFocused
                        autoComplete="lastname"
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>
                <div>
                    <InputLabel htmlFor="gender" value="Gender" />
                    <Select
                        name="gender"
                        options={genderOptions}
                        onChange={(e) => setData("gender", e.target.value)}
                        isFocused={true}
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>
                <div>
                    <InputLabel htmlFor="birthday" value="Birthday" />
                    <TextInput
                        id="birthday"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.birthday}
                        onChange={(e) => setData("birthday", e.target.value)}
                        required
                        isFocused
                        autoComplete="birthday"
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>
                <div>
                    <InputLabel htmlFor="civil_status" value="Civil Status" />
                    <Select
                        name="civil_status"
                        options={civilStatusOptions}
                        onChange={(e) =>
                            setData("civil_status", e.target.value)
                        }
                        isFocused={true}
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>
                <div>
                    <InputLabel htmlFor="religion" value="Religion" />
                    <TextInput
                        id="religion"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.religion}
                        onChange={(e) => setData("religion", e.target.value)}
                        required
                        isFocused
                        autoComplete="religion"
                    />
                    <InputError className="mt-2" message={errors.id} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Update</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Updated.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
};

export default UpdateProfile;
