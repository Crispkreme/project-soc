import React, { useEffect, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { TbUsersPlus } from "react-icons/tb";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modals/Modal";
import Title from "@/Components/Headers/Title";
import InputLabel from "@/Components/Inputs/InputLabel";
import TextInput from "@/Components/Inputs/TextInput";
import Select from "@/Components/Inputs/Select";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import InputError from "@/Components/Inputs/InputError";

const genderOptions = [
  { value: "", label: "Select Gender", disabled: true },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const civilStatusOptions = [
  { value: "", label: "Select Civil Status", disabled: true },
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Separated", label: "Separated" },
  { value: "Divorced", label: "Divorced" },
];

const calculateAge = (birthday) => {
  if (!birthday) return "";
  const today = new Date();
  const birthDate = new Date(birthday);
  let ageYears = today.getFullYear() - birthDate.getFullYear();
  const ageMonth = today.getMonth() - birthDate.getMonth();

  if (
    ageMonth < 0 ||
    (ageMonth === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageYears--;
  }

  return ageYears;
};

const AccountModal = ({ showModal, toggleModal, userDetail, isPage }) => {

  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);

  const { data, setData, post, processing, errors } = useForm({
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    birthday: "",
    religion: "",
    address: "",
    civil_status: "",
    isPage: isPage || "",
    profile: null,
  });

  useEffect(() => {
    if (userDetail) {
      setData({
        firstname: userDetail.firstname || "",
        middlename: userDetail.middlename || "",
        lastname: userDetail.lastname || "",
        gender: userDetail.gender || "",
        birthday: userDetail.birthday || "",
        religion: userDetail.religion || "",
        address: userDetail.address || "",
        civil_status: userDetail.civil_status || "",
        isPage: isPage || "",
      });
    }
  }, [userDetail, isPage]);

  const handleChange = (field, value) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setAvatar(URL.createObjectURL(uploadedFile));
    }
  };

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (file) {
      formData.append("profile", file);
    }

    post(route("store.profile.detail"), {
      data: formData,
      onError: (errors) => console.error(errors),
    });
  };

  return (
    <Modal show={showModal} onClose={toggleModal}>
      <div className="p-6">
        <Title>
          <TbUsersPlus className="mr-2" />
          Add Account
        </Title>

        <form onSubmit={submit}>
          <div className="w-full rounded-sm text-center mb-5">
            <div
              className="mx-auto flex justify-center w-[141px] h-[141px] rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  avatar || "https://via.placeholder.com/141"
                })`,
              }}
            >
              <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                <input
                  type="file"
                  name="profile"
                  id="upload_profile"
                  hidden
                  onChange={handleFileChange}
                />
                <label htmlFor="upload_profile">
                  <IoCameraOutline className="w-6 h-5 text-blue-700" />
                </label>
              </div>
            </div>
            <h2 className="text-center mt-2 font-semibold">Upload Profile</h2>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <InputLabel htmlFor="firstname" value="Firstname" />
              <TextInput
                id="firstname"
                value={data.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                required
              />
              <InputError message={errors.firstname} />
            </div>
            <div>
              <InputLabel htmlFor="middlename" value="Middlename" />
              <TextInput
                id="middlename"
                value={data.middlename}
                onChange={(e) => handleChange("middlename", e.target.value)}
              />
              <InputError message={errors.middlename} />
            </div>
            <div>
              <InputLabel htmlFor="lastname" value="Lastname" />
              <TextInput
                id="lastname"
                value={data.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
                required
              />
              <InputError message={errors.lastname} />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 justify-center w-full mb-4">
            <div className="col-span-12 md:col-span-4">
              <InputLabel htmlFor="birthday" value="Date of Birth" />
              <TextInput
                id="birthday"
                type="date"
                name="birthday"
                value={data.birthday}
                className="mt-1 block w-full"
                onChange={(e) => handleChange("birthday", e.target.value)}
                required
              />
              <InputError message={errors.birthday} />
            </div>
            <div className="col-span-12 md:col-span-1">
              <InputLabel htmlFor="age" value="Age" />
              <TextInput
                id="age"
                type="text"
                value={calculateAge(data.birthday)}
                className="mt-1 block w-full"
                disabled
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <InputLabel htmlFor="gender" value="Gender" />
              <Select
                options={genderOptions}
                name="gender"
                value={data.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full mt-1"
              />
              <InputError message={errors.gender} />
            </div>
            <div className="col-span-12 md:col-span-3 md:ml-4">
              <InputLabel htmlFor="civil_status" value="Civil Status" />
              <Select
                options={civilStatusOptions}
                name="civil_status"
                value={data.civil_status}
                onChange={(e) =>
                  handleChange("civil_status", e.target.value)
                }
                className="w-full mt-1"
              />
              <InputError message={errors.civil_status} />
            </div>
          </div>

          {/* Religion and Address */}
          <div className="w-full mb-4">
            <InputLabel htmlFor="religion" value="Religion" />
            <TextInput
              id="religion"
              type="text"
              name="religion"
              value={data.religion}
              onChange={(e) => handleChange("religion", e.target.value)}
              required
            />
            <InputError message={errors.religion} />
          </div>
          <div className="w-full">
            <InputLabel htmlFor="address" value="Address" />
            <textarea
              id="address"
              name="address"
              rows={5}
              placeholder="Address"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full"
            />
            <InputError message={errors.address} />
          </div>

          <div className="mt-6 text-right">
            <PrimaryButton processing={processing}>Add Account</PrimaryButton>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AccountModal;
