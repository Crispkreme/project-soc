import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { storeFamilyRecord as storeFamilyRecordService } from "../../services/MedicalRecord";
import { getAllDoctor } from "../../services/Doctor";
import { getAllHospitals } from "../../services/MedicalResult";

const HospitalizationResultModal = ({ visible, onClose, userId }) => {
  const [disease, setDisease] = useState(""); // Correctly define the disease state
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]); // Store hospitals
  const [doctors, setDoctors] = useState([]); // Store doctors
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Store selected doctor
  const [selectedHospital, setSelectedHospital] = useState(null); // Store selected hospital

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!visible) return;
      setLoading(true);
      try {
        const response = await getAllDoctor();
        if (response?.doctor) {
          setDoctors(response.doctor);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to fetch doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchHospitals = async () => {
      if (!visible) return;
      setLoading(true);
      try {
        const response = await getAllHospitals();
        console.log('hospital', response);
        if (response?.hospital) {
          setHospitals(response.hospital);
        } else {
          setHospitals([]);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to fetch hospitals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    fetchHospitals();
  }, [visible]);

  const handleStoreFamilyRecord = async () => {
    if (!disease || !selectedDoctor || !selectedHospital) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        patient_id: userId,
        disease,
        doctor_id: selectedDoctor, // Send doctor ID as part of the submission
        hospital_id: selectedHospital, // Send hospital ID as part of the submission
      };

      const response = await storeFamilyRecordService(submissionData);

      if (response && response.success) {
        Alert.alert("Success", "Family record saved successfully.");
        setDisease(""); // Reset the disease input field
        setSelectedDoctor(null); // Reset doctor picker
        setSelectedHospital(null); // Reset hospital picker
        onClose(); // Close modal
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to save health record."
        );
      }
    } catch (error) {
      console.error("Error storing family medical record:", error);
      Alert.alert(
        "Error",
        "Failed to save family medical record. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add Hospitalization Result</Text>

          {/* Doctor Picker */}
          <Picker
            selectedValue={selectedDoctor}
            onValueChange={(itemValue) => setSelectedDoctor(itemValue)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select Doctor" value={null} />
            {doctors.map((doctor) => (
              <Picker.Item key={doctor.id} label={doctor.name} value={doctor.id} />
            ))}
          </Picker>

          {/* Hospital Picker */}
          <Picker
            selectedValue={selectedHospital}
            onValueChange={(itemValue) => setSelectedHospital(itemValue)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select Hospital" value={null} />
            {hospitals.map((hospital) => (
              <Picker.Item key={hospital.id} label={hospital.name} value={hospital.id} />
            ))}
          </Picker>

          {/* Diagnosis Input */}
          <TextInput
            placeholder="Diagnosis"
            value={disease} // Correctly use disease state
            onChangeText={setDisease}
            style={styles.input}
          />

          <Button
            title={submitting ? "Saving..." : "Add Family Medical Record"}
            onPress={handleStoreFamilyRecord}
            disabled={submitting}
          />
          <Button
            title="Close"
            onPress={() => {
              setDisease(""); // Reset on close
              setSelectedDoctor(null); // Reset doctor picker
              setSelectedHospital(null); // Reset hospital picker
              onClose(); // Close the modal
            }}
            color="red"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default HospitalizationResultModal;
