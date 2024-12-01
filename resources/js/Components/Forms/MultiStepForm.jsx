import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'react-hot-toast';

const InputLabel = React.lazy(() => import("@/Components/Inputs/InputLabel"));
const TextInput = React.lazy(() => import("@/Components/Inputs/TextInput"));
const Textarea = React.lazy(() => import("@/Components/Inputs/Textarea"));
const Title = React.lazy(() => import("@/Components/Headers/Title"));

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', username: '', password: '', password_confirmation: '', firstname: '', middlename: '', lastname: '', gender: '', birthday: '', civil_status: '', religion: '', address: '' });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    const errors = [];
    switch (step) {
      case 1:
        const { firstname, lastname, birthday, gender, civil_status, religion, address } = formData;
        if (!firstname || !lastname || !birthday || !religion || !address || !gender || !civil_status) {
          errors.push("Complete all fields in Step 1.");
        }
        break;
      case 2:
        const { username, email, password, password_confirmation } = formData;
        if (!username || !email || !password || password !== password_confirmation) {
          errors.push("Complete all fields and ensure passwords match in Step 2.");
        }
        break;
      default:
        break;
    }
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }
    return true;
  };
  
  const handleDropdownChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post(route("register"), formData, {
      onSuccess: (response) => {
        console.log("response", response);
        toast.success("Account added successfully!");
      },
      onError: (errors) => {
        toast.error("An error occurred during account creation.");
      },
    });
  };
  
  const genderOptions = [
    { value: 'Male', option: 'Male' },
    { value: 'Female', option: 'Female' },
  ];

  const civilStatusOptions = [
    { value: 'Single', option: 'Single' },
    { value: 'Married', option: 'Married' },
    { value: 'Divorce', option: 'Divorce' },
    { value: 'Separated', option: 'Separated' },
  ];

  const calculateAge = (birthday) => {
    if (!birthday) return "";
  
    const birthDate = new Date(birthday);
    const today = new Date();
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age > 0 ? age : "";
  };

  return (
    <>
        <Title>Register Account</Title>
        <div className="mb-8 mt-3">
            <div className="flex justify-between mb-2">
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 ${currentStep >= 1 ? '' : 'opacity-50'}`}> Personal Info </span>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 ${currentStep >= 2 ? '' : 'opacity-50'}`}> Account Details </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                style={{ width: `${(currentStep / 2) * 100}%` }}></div>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
                <div className="step mb-6">
                    <div className="mt-4">
                        <InputLabel value="Full Name" />
                        <div className="flex space-x-4">
                            <TextInput id="firstname" name="firstname" value={formData.firstname} className="w-2/5" onChange={handleInputChange} placeholder="Firstname" required />
                            <TextInput id="middlename" name="middlename" placeholder="M.I.:" className="w-1/6" value={formData.middlename} onChange={handleInputChange} />
                            <TextInput id="lastname" name="lastname" className="w-2/5" placeholder="Lastname" value={formData.lastname} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex space-x-4">
                            <div className="w-3/5">
                                <InputLabel value="Birthday" />
                                <TextInput id="birthday" type="date" name="birthday" value={formData.birthday} className="mt-1 block w-full" onChange={(e) => handleInputChange(e)} required
                                />
                            </div>
                            <div className="">
                                <InputLabel htmlFor="age" value="Age" />
                                <TextInput id="age" name="age" value={formData.birthday ? calculateAge(formData.birthday) : ""} disabled className="block w-2/5" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                        <div className="w-1/2">
                            <InputLabel htmlFor="gender" value="Gender" />
                            <select name="gender" value={formData.gender} onChange={(e) => handleDropdownChange('gender', e.target.value)}>
                            <option value="" disabled>
                                Select Gender
                            </option>
                            {genderOptions.map(({ value, option }) => (
                                <option key={value} value={value}>
                                {option}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="w-1/2">
                            <InputLabel htmlFor="civil_status" value="Civil Status" />
                            <select name="civil_status" value={formData.civil_status} onChange={(e) => handleDropdownChange('civil_status', e.target.value)}>
                                <option value="" disabled>
                                    Select Civil Status
                                </option>
                                {civilStatusOptions.map(({ value, option }) => (
                                    <option key={value} value={value}>
                                    {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <InputLabel htmlFor="religion" value="Religion" />
                        <TextInput id="religion" name="religion" className="w-full" value={formData.religion} onChange={handleInputChange} required />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="address" value="Address" />
                        <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required className="mt-1 block w-full"
                        />
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="step mb-6">
                    <div>
                        <InputLabel htmlFor="username" value="Username" />
                        <TextInput className="w-full" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput className="w-full" id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput className="w-full" id="password" type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput className="w-full" id="password_confirmation" type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleInputChange} required />
                    </div>
                </div>
            )}
            <div className="flex justify-between">
                {currentStep > 1 && (
                    <button type="button" onClick={handlePrev} className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg">
                        Previous
                    </button>
                )}
                <button
                    type="submit"
                    onClick={currentStep === 1 ? handleNext : handleSubmit}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                >
                    {currentStep === 2 ? 'Submit' : 'Next'}
                </button>
            </div>
        </form>
    </>
  );
};

export default MultiStepForm;
