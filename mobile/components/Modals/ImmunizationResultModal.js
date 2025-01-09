import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllDoctor } from "../../services/Doctor";
import { storeImmunizationResult } from "../../services/MedicalRecord";

const ImmunizationResultModal = ({ visible, onClose, userId }) => {
  const [immunization, setImmunization] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    fetchDoctors();
  }, [visible]);

  const handleStoreImmunizationRecord = async () => {
    if (!immunization || !doctorId) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        immunization,
        patient_id: userId,
        doctor_id: doctorId,
        date: new Date().toISOString(),
      };

      const response = await storeImmunizationResult(submissionData);

      if (response?.success) {
        Alert.alert("Success", "Immunization record saved successfully.");
        setImmunization("");
        setDoctorId(null);
        onClose();
      } else {
        Alert.alert("Error", response.message || "Failed to save immunization record.");
      }
    } catch (error) {
      console.error("Error storing immunization record:", error);
      Alert.alert("Error", "Failed to save immunization record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add Immunization Record</Text>
          
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={doctorId}
              onValueChange={(itemValue) => setDoctorId(itemValue)}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Doctor" value={null} />
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <Picker.Item
                    key={doctor.id}
                    label={doctor.name}
                    value={doctor.id}
                  />
                ))
              ) : (
                <Picker.Item label="No doctors available" value={null} />
              )}
            </Picker>
          )}

          <TextInput
            placeholder="Immunization Type"
            value={immunization}
            onChangeText={setImmunization}
            style={styles.input}
          />

          <Button
            title={submitting ? "Saving..." : "Add Immunization Record"}
            onPress={handleStoreImmunizationRecord}
            disabled={submitting}
          />
          
          <Button
            title="Close"
            onPress={() => {
              setImmunization("");
              setDoctorId(null);
              onClose();
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

export default ImmunizationResultModal;
