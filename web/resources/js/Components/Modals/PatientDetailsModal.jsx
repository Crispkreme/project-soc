import Modal from "@/Components/Modals/Modal";
import Title from "@/Components/Headers/Title";
import InputLabel from "@/Components/Inputs/InputLabel";
import TextInput from "@/Components/Inputs/TextInput";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function PatientDetailsModal({ showModal, toggleModal, patient }) {
    const patientInfo = patient?.patient_details || {};
    const appointmentInfo = patient || {};

    if (!patientInfo) return null;

    return (
        <Modal show={showModal} onClose={toggleModal}>
            <div className="p-6">
                <Title>
                    Patient Details
                </Title>

                <form>
                    <div className="grid grid-cols-3 gap-4 mb-4 mt-4">
                        <div className="col-span-1">
                            <InputLabel htmlFor="firstname" value="Firstname" />
                            <TextInput
                                id="firstname"
                                value={patientInfo?.firstname || ""}
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="middlename" value="Middlename" />
                            <TextInput
                                id="middlename"
                                value={patientInfo?.middlename || ""}
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="lastname" value="Lastname" />
                            <TextInput
                                id="lastname"
                                value={patientInfo?.lastname || ""}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 justify-center w-full mb-4">
                        <div className="col-span-2">
                            <InputLabel htmlFor="birthday" value="Date of Birth" />
                            <TextInput
                                id="birthday"
                                type="date"
                                value={patientInfo?.birthday || ""}
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="gender" value="Gender" />
                            <TextInput
                                id="gender"
                                value={patientInfo?.gender || ""}
                                disabled
                            />
                        </div>
                        <div className="col-span-2">
                            <InputLabel htmlFor="civil_status" value="Civil Status" />
                            <TextInput
                                id="civil_status"
                                value={patientInfo?.civil_status || ""}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 w-full">
                        <div className="col-span-1">
                            <InputLabel htmlFor="religion" value="Religion" />
                            <TextInput
                                id="religion"
                                value={patientInfo?.religion || ""}
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="status" value="Status" />
                            <TextInput
                                id="status"
                                value={patientInfo?.status || ""}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="w-full mb-4">
                        <InputLabel htmlFor="address" value="Address" />
                        <textarea
                            id="address"
                            name="address"
                            rows={3}
                            placeholder="Address"
                            value={patientInfo?.address || "No Address Provided"}
                            disabled
                            className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 block w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-1">
                            <InputLabel htmlFor="appointment" value="Appointment" />
                            <TextInput
                                id="appointment"
                                value={appointmentInfo?.title || ""}
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="date" value="Appointment Date" />
                            <TextInput
                                id="date"
                                value={appointmentInfo?.appointment_date || ""}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-right">
                        <PrimaryButton type="button" onClick={toggleModal}>
                            Close
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
