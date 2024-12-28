import React, { useEffect, useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modals/Modal";
import Title from "@/Components/Headers/Title";
import InputLabel from "@/Components/Inputs/InputLabel";
import TextInput from "@/Components/Inputs/TextInput";
import { toast } from 'react-hot-toast';
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

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    console.log("formData", formData);
    post(route("store.profile.detail"), {
      data: formData,
      onSuccess: (response) => {
        toggleModal(false);
        toast.success("Account added successfully!");
      },
      onError: (errors) => {
        toggleModal(false);
        toast.error("An error occurred during account creation.");
      },
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
          {/* Personal Information */}
          <div className="grid grid-cols-3 gap-4 mb-4 mt-4">
            <div className="col-span-1">
              <InputLabel htmlFor="firstname" value="Firstname" />
              <TextInput
                id="firstname"
                value={data.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
              />
              {data.firstname === "" && (
                <InputError message="Firstname is required" />
              )}
            </div>
            <div className="col-span-1">
              <InputLabel htmlFor="middlename" value="Middlename" />
              <TextInput
                id="middlename"
                value={data.middlename}
                onChange={(e) => handleChange("middlename", e.target.value)}
              />
              <InputError message={errors.middlename} />
            </div>
            <div className="col-span-1">
              <InputLabel htmlFor="lastname" value="Lastname" />
              <TextInput
                id="lastname"
                value={data.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
                required
              />
              {data.lastname === "" && (
                <InputError message="Lastname is required" />
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-5 gap-4 justify-center w-full mb-4">
            <div className="col-span-2">
              <InputLabel htmlFor="birthday" value="Date of Birth" />
              <TextInput
                id="birthday"
                type="date"
                name="birthday"
                value={data.birthday}
                className="mt-1 block w-full"
                onChange={(e) => handleChange("birthday", e.target.value)}
              />
              {data.birthday === "" && (
                <InputError message="Birthday is required" />
              )}
            </div>
            <div className="col-span-1">
              <InputLabel htmlFor="age" value="Age" />
              <TextInput
                id="age"
                type="text"
                value={calculateAge(data.birthday)}
                className={`mt-1 block w-full ${calculateAge(data.birthday) === 0 ? "border-red-500" : ""}`}
                disabled
              />
              {calculateAge(data.birthday) === 0 && (
                <InputError message="Age must be greater than 0." />
              )}
            </div>
            <div className="col-span-2">
              <InputLabel htmlFor="gender" value="Gender" />
              <Select
                options={genderOptions}
                name="gender"
                value={data.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full mt-1"
                required
              />
              {data.gender === "" && (
                <InputError message="Gender is required" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 w-full">
            <div className="col-span-1">
              <InputLabel htmlFor="religion" value="Religion" />
              <TextInput
                id="religion"
                type="text"
                className="w-full mt-1"
                name="religion"
                value={data.religion}
                onChange={(e) => handleChange("religion", e.target.value)}
                required
              />
              {data.religion === "" && (
                <InputError message="Religion is required" />
              )}
            </div>
            <div className="col-span-1">
              <InputLabel htmlFor="civil_status" value="Civil Status" />
              <Select
                options={civilStatusOptions}
                name="civil_status"
                value={data.civil_status}
                onChange={(e) => handleChange("civil_status", e.target.value)}
                className="w-full mt-1"
              />
              {data.civil_status === "" && (
                <InputError message="Civil Status is required" />
              )}
            </div>
          </div>
          <div className="w-full">
            <InputLabel htmlFor="address" value="Address" />
            <textarea
              id="address"
              name="address"
              rows={5}
              placeholder="Address"
              value={data.address}
              required
              onChange={(e) => handleChange("address", e.target.value)}
              className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-full ${
                data.address && !data.address.toLowerCase().includes("lapay")
                  ? "border-red-500"
                  : ""
              }`}
            />
            {data.address === "" && <InputError message="Address is required" />}
            {data.address !== "" && !data.address.toLowerCase().includes("lapay") && (
              <InputError message="You must be a resident of Lapay" />
            )}
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
