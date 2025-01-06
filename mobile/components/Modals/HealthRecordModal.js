import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllMedicine } from "../../services/Medicine";
import { storeHealthRecord as storeHealthRecordService } from "../../services/MedicalRecord";

const HealthRecordModal = ({ visible, onClose, userId }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicineId, setMedicineId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!visible) return;
      setLoading(true);
      try {
        const response = await getAllMedicine();
        if (response) {
          setMedicines(response);
        } else {
          setMedicines([]);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Unable to fetch medicines. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [visible]);

  const handleStoreHealthRecord = async () => {
    if (!diagnosis || !medicineId) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        diagnosis,
        patient_id: userId,
        medicine_id: medicineId,
        date: new Date().toISOString(),
      };
      console.log("submissionData:", submissionData);

      const response = await storeHealthRecordService(submissionData);

      if (response && response.success) {
        Alert.alert("Success", "Health record saved successfully.");
        setDiagnosis("");
        setMedicineId(null);
        onClose();
      } else {
        Alert.alert("Error", response.message || "Failed to save health record.");
      }
    } catch (error) {
      console.error("Error storing health record:", error);
      Alert.alert("Error", "Failed to save health record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Rendering the modal
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add Health Record</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={medicineId}
              onValueChange={(itemValue) => setMedicineId(itemValue)}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Medicine" value={null} />
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <Picker.Item
                    key={medicine.id}
                    label={medicine.medicine_name}
                    value={medicine.id}
                  />
                ))
              ) : (
                <Picker.Item label="No medicines available" value={null} />
              )}
            </Picker>
          )}

          <TextInput
            placeholder="Diagnosis"
            value={diagnosis}
            onChangeText={setDiagnosis}
            style={styles.input}
          />
          <Button
            title={submitting ? "Saving..." : "Add Health Record"}
            onPress={handleStoreHealthRecord}
            disabled={submitting}
          />
          <Button title="Close" onPress={() => { setDiagnosis(""); setMedicineId(null); onClose(); }} color="red" />
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

export default HealthRecordModal;
